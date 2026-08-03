const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const User = require("../src/models/User");
const Fund = require("../src/models/Fund");
const { normalizeFundAmount, isAllowedFundStatus } = require("../src/utils/fundRules");
const { allowRoles, allowSelfOrRoles } = require("../src/middleware/authorization");
const fundsController = require("../src/controller/funds/fundsController");

function mockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return body;
    },
  };
}

test("fund rules reject invalid values and accept valid deposit actions", () => {
  assert.equal(normalizeFundAmount("25.556"), 25.56);
  assert.equal(normalizeFundAmount(0), null);
  assert.equal(normalizeFundAmount(-10), null);
  assert.equal(normalizeFundAmount("not-a-number"), null);
  assert.equal(isAllowedFundStatus("approved"), true);
  assert.equal(isAllowedFundStatus("rejected"), true);
  assert.equal(isAllowedFundStatus("pending"), false);
});

test("fund amount schema prevents negative deposits", async () => {
  const base = { userId: "507f1f77bcf86cd799439011" };
  await assert.rejects(new Fund({ ...base, balance: -1 }).validate(), /balance/);
  await assert.doesNotReject(new Fund({ ...base, balance: 10 }).validate());
});

test("deposit access permits an administrator or the same user only", () => {
  const guard = allowSelfOrRoles((req) => req.body.userID, "admin");
  let nextCalls = 0;
  guard({ user: { id: "user-1", role: "user" }, body: { userID: "user-1" } }, mockResponse(), () => { nextCalls += 1; });
  guard({ user: { id: "admin-1", role: "admin" }, body: { userID: "user-1" } }, mockResponse(), () => { nextCalls += 1; });
  const denied = mockResponse();
  guard({ user: { id: "user-2", role: "user" }, body: { userID: "user-1" } }, denied, () => { nextCalls += 1; });
  assert.equal(nextCalls, 2);
  assert.equal(denied.statusCode, 403);

  const adminGuard = allowRoles("admin");
  const nonAdmin = mockResponse();
  adminGuard({ user: { role: "user" } }, nonAdmin, () => { nextCalls += 1; });
  assert.equal(nonAdmin.statusCode, 403);
});

test("admin add-funds keeps the MongoDB ObjectId as a string", () => {
  const source = fs.readFileSync(path.join(__dirname, "../../frontend/src/pages/admin/AddFundsModal.jsx"), "utf8");
  assert.match(source, /\{ userID, amount: Number\(amount\) \}/);
  assert.doesNotMatch(source, /userID:\s*Number\(userID\)/);
});

test("an already processed deposit cannot credit the user again", async (t) => {
  const originalFindOneAndUpdate = Fund.findOneAndUpdate;
  const originalExists = Fund.exists;
  const originalUserUpdate = User.findByIdAndUpdate;
  t.after(() => {
    Fund.findOneAndUpdate = originalFindOneAndUpdate;
    Fund.exists = originalExists;
    User.findByIdAndUpdate = originalUserUpdate;
  });

  let credits = 0;
  Fund.findOneAndUpdate = async (query) => {
    assert.equal(query.status, "pending");
    return null;
  };
  Fund.exists = async () => true;
  User.findByIdAndUpdate = async () => { credits += 1; };

  const response = mockResponse();
  await fundsController.updateFundStatus(
    { params: { fundID: "507f1f77bcf86cd799439015" }, body: { status: "approved" } },
    response
  );
  assert.equal(response.statusCode, 409);
  assert.equal(credits, 0);
});
