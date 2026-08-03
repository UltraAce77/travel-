const express = require("express");
const router = express.Router();

const funds = require("../controller/funds/fundsController");
const auth = require("../controller/auth/authController");
const { allowRoles, allowSelfOrRoles } = require("../middleware/authorization");

router.post(
  "/add",
  auth.verifyToken,
  allowSelfOrRoles((req) => req.body.userID, "admin"),
  funds.addFunds
);
router.get("/fetch", auth.verifyToken, allowRoles("admin"), funds.getAllFunds);
router.put("/update/:fundID", auth.verifyToken, allowRoles("admin"), funds.updateFundStatus);

module.exports = router;
