const express = require("express");
const router = express.Router();

const user = require("../controller/user/userController"); // user Routes for admin
const auth = require("../controller/auth/authController");
const { allowRoles, allowSelfOrRoles } = require("../middleware/authorization");

router.get("/fetch", auth.verifyToken, allowRoles("admin", "manager"), user.fetchUser);
router.post("/create", auth.verifyToken, allowRoles("admin"), user.createUser);
router.put("/update/:id", auth.verifyToken, allowRoles("admin"), user.updateUser);
router.put(
  "/addWallet",
  auth.verifyToken,
  allowSelfOrRoles((req) => req.body.userID, "admin"),
  user.addWallet
);
router.get(
  "/",
  auth.verifyToken,
  allowSelfOrRoles((req) => req.query.id, "admin"),
  user.fetchUserById
); // Get current user data

module.exports = router;
