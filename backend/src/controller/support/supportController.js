const crypto = require("crypto");
const Response = require("../../utils/response");

const tawkIdentity = async (req, res) => {
   const key = process.env.TAWK_API_KEY;
   if (!key) return res.status(503).json(new Response(null, "Tawk.to secure mode is not configured", 503, "error"));
   const email = String(req.user.email).toLowerCase();
   const hash = crypto.createHmac("sha256", key).update(email).digest("hex");
   return res.json(new Response({ name: req.user.userName, email, hash }, "Tawk.to identity", 200));
};

module.exports = { tawkIdentity };