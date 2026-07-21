const express = require("express");
const router = express.Router();

const user = require("../controller/user/userController"); // user Routes for admin
const auth = require("../controller/auth/authController");

router.get("/fetch", user.fetchUser);
router.post("/create", auth.verifyToken, user.createUser);
router.put("/update/:id", user.updateUser);
router.put("/addWallet", user.addWallet);
router.get("/", user.fetchUserById); // Get the current userdata from login token

module.exports = router;
