const express = require("express");
const auth = require("../controller/auth/authController");
const support = require("../controller/support/supportController");
const router = express.Router();

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Logged-in user → Tawk secure-mode identity
router.get("/tawk-identity", auth.verifyToken, wrap(support.tawkIdentity));

// Public: Tawk.to posts chat/ticket events here (configure in Tawk → Webhooks)
router.post("/webhook", wrap(support.webhook));

// Admin (read-only) inbox
router.get("/conversations", auth.verifyToken, wrap(support.listConversations));
router.get("/conversations/:id", auth.verifyToken, wrap(support.getConversation));
router.get("/unread-count", auth.verifyToken, wrap(support.unreadCount));

module.exports = router;
