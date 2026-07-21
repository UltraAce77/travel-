const test = require("node:test");
const assert = require("node:assert/strict");
const User = require("../src/models/User");
const Trek = require("../src/models/Trek");
const Fund = require("../src/models/Fund");
const Assignment = require("../src/models/Assignment");
const catalog = require("../db/trekCatalog");
const { publicUser, trek, assignment } = require("../src/utils/mongoResponse");
const { assignmentOrder, completionCredit } = require("../src/utils/trekProgress");

test("MongoDB models are registered", () => {
  assert.equal(User.modelName, "User");
  assert.equal(Trek.modelName, "Trek");
  assert.equal(Fund.modelName, "Fund");
  assert.equal(Assignment.modelName, "Assignment");
});

test("legacy API identifiers and image URLs are preserved", () => {
  const user = new User({ _id: "507f1f77bcf86cd799439011", userName: "Test", email: "test@example.com", password: "hash", role: "user" });
  const item = new Trek({ _id: "507f1f77bcf86cd799439012", title: "Trip", price: 10, commission: 1, imageUrl: "https://example.com/trip.jpg" });
  assert.equal(publicUser(user, true).id, "507f1f77bcf86cd799439011");
  assert.equal(trek(item).trekID, "507f1f77bcf86cd799439012");
  assert.equal(trek(item).imageUrl, "https://example.com/trip.jpg");
});

test("assignment reviews and archive state are serialized", () => {
  const trekItem = new Trek({ _id: "507f1f77bcf86cd799439012", title: "Trip", price: 10, commission: 1, imageUrl: "https://example.com/trip.jpg" });
  const item = new Assignment({ _id: "507f1f77bcf86cd799439013", userId: "507f1f77bcf86cd799439011", trekId: trekItem, price: 10, commission: 1, status: "completed", rating: 5, description: "Excellent", archived: true });
  assert.deepEqual(assignment(item), { assignmentID: "507f1f77bcf86cd799439013", trekID: "507f1f77bcf86cd799439012", price: 10, commission: 1, status: "completed", rating: 5, description: "Excellent", archived: true, title: "Trip", picture: null, imageUrl: "https://example.com/trip.jpg", imageSource: null });
});

test("assignment rating validation accepts only 1 through 5", async () => {
  const base = { userId: "507f1f77bcf86cd799439011", trekId: "507f1f77bcf86cd799439012", price: 10 };
  await assert.rejects(new Assignment({ ...base, rating: 0 }).validate(), /rating/);
  await assert.doesNotReject(new Assignment({ ...base, rating: 5 }).validate());
});

test("catalog contains 100 unique treks and unique raster images", () => {
  assert.equal(catalog.length, 100);
  assert.equal(new Set(catalog.map((item) => item.title)).size, 100);
  assert.equal(new Set(catalog.map((item) => item.imageUrl)).size, 100);
  assert.equal(catalog.every((item) => /^https:\/\/upload\.wikimedia\.org\/.+\.(?:jpe?g|png|webp)(?:$|\?)/i.test(item.imageUrl)), true);
});

test("password is excluded by default", () => {
  assert.equal(User.schema.path("password").options.select, false);
});

test("treks use a deterministic sequence", () => {
  assert.deepEqual(assignmentOrder, { createdAt: 1, _id: 1 });
});

test("trek completion credits both balance and commission", () => {
  assert.deepEqual(completionCredit(2.5), { earned: 2.5, update: { $inc: { "record.totalBalance": 2.5, "record.commission": 2.5, "record.completedTreks": 1 } } });
});
