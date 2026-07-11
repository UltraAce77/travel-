const express = require("express");
const router = express.Router();
const Response = require("../utils/response");
const { testDBConnection } = require("../config/database");

const user = require("../controller/auth/authController");

// Health check route for database
router.get("/health", async (req, res) => {
   try {
      await testDBConnection();
      res.json(new Response(null, "Database connection is healthy", 200));
   } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json(new Response(null, "Database connection error", 500));
   }
});

// routes for login

router.post("/register", user.register);

router.post("/login", user.login);

// Token verification route
router.get("/verifyToken", user.verifyToken, (req, res) => {
   res.json(new Response(req.user, "Token verified successfully", 201));
});

// using middleware to verify token

router.get("/protected-route", user.verifyToken, (req, res) => {
   // req.user will contain the user data
   res.json(new Response(req.user, "User data retrieved successfully", 201));
});

router.get("/verify", user.verifyUser);

router.get("/logout", user.logout);
router.get("/fetch", user.displayUsers);

// Token refresh route
router.post("/refreshToken", user.refreshToken);

module.exports = router;
