const express = require("express");
const auth = require("../controller/auth/authController");
const support = require("../controller/support/supportController");
const router = express.Router();
router.get("/tawk-identity", auth.verifyToken, (req, res, next) => Promise.resolve(support.tawkIdentity(req, res, next)).catch(next));
module.exports = router;