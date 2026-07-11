const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const Response = require("../../utils/response");

function requireAdmin(req, res) {
   if (req.user?.role === "admin") return true;
   res.status(403).json(new Response(null, "Administrator access required", 403, "error"));
   return false;
}

const listAgents = async (req, res) => {
   if (!requireAdmin(req, res)) return;
   const agents = await User.find({ role: "customer_support" }).sort({ createdAt: -1 });
   return res.json(new Response(agents.map((agent) => ({ id: agent._id.toString(), userName: agent.userName, email: agent.email, active: agent.active, createdAt: agent.createdAt })), "Support agents fetched", 200));
};

const createAgent = async (req, res) => {
   if (!requireAdmin(req, res)) return;
   const { userName, email, password } = req.body;
   if (!userName || !email || !password || String(password).length < 10) return res.status(400).json(new Response(null, "Name, email, and a password of at least 10 characters are required", 400, "error"));
   if (await User.exists({ $or: [{ userName }, { email: String(email).toLowerCase() }] })) return res.status(409).json(new Response(null, "Username or email already exists", 409, "error"));
   const agent = await User.create({ userName, email, password: await bcrypt.hash(String(password), 10), role: "customer_support" });
   return res.status(201).json(new Response({ id: agent._id.toString(), userName: agent.userName, email: agent.email, role: agent.role }, "Customer support account created", 201));
};

const setAgentStatus = async (req, res) => {
   if (!requireAdmin(req, res)) return;
   const agent = await User.findOneAndUpdate({ _id: req.params.id, role: "customer_support" }, { active: Boolean(req.body.active) }, { new: true });
   if (!agent) return res.status(404).json(new Response(null, "Support agent not found", 404, "error"));
   return res.json(new Response({ id: agent._id.toString(), active: agent.active }, agent.active ? "Support agent activated" : "Support agent disabled", 200));
};

const tawkIdentity = async (req, res) => {
   const key = process.env.TAWK_API_KEY;
   if (!key) return res.status(503).json(new Response(null, "Tawk.to secure mode is not configured", 503, "error"));
   const email = String(req.user.email).toLowerCase();
   const hash = crypto.createHmac("sha256", key).update(email).digest("hex");
   return res.json(new Response({ name: req.user.userName, email, hash }, "Tawk.to identity", 200));
};

module.exports = { listAgents, createAgent, setAgentStatus, tawkIdentity };