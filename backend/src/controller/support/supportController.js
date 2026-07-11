const crypto = require("crypto");
const Response = require("../../utils/response");
const SupportChat = require("../../models/SupportChat");

// ── Existing: Tawk.to secure-mode identity (unchanged) ──
const tawkIdentity = async (req, res) => {
  const key = process.env.TAWK_API_KEY;
  if (!key) return res.status(503).json(new Response(null, "Tawk.to secure mode is not configured", 503, "error"));
  const email = String(req.user.email).toLowerCase();
  const hash = crypto.createHmac("sha256", key).update(email).digest("hex");
  return res.json(new Response({ name: req.user.userName, email, hash }, "Tawk.to identity", 200));
};

// ── Tawk.to webhook: store incoming chats/tickets for the read-only admin view ──
// Configure in Tawk dashboard → Administration → Webhooks → URL: <backend>/support/webhook
const webhook = async (req, res) => {
  try {
    // Optional signature check (Tawk signs the raw body with HMAC-SHA1 using the webhook secret).
    const secret = process.env.TAWK_WEBHOOK_SECRET;
    if (secret && req.rawBody) {
      const sig = req.headers["x-tawk-signature"];
      const digest = crypto.createHmac("sha1", secret).update(req.rawBody).digest("hex");
      if (sig !== digest) return res.status(401).send("invalid signature");
    }

    const b = req.body || {};
    const event = b.event || "";
    const visitor = b.visitor || b.requester || {};
    const visitorName = visitor.name || "Visitor";
    const visitorEmail = visitor.email || "";

    // Offline message / ticket
    if (event === "ticket:create") {
      const t = b.ticket || {};
      await SupportChat.create({
        kind: "ticket",
        status: "ticket",
        visitorName,
        visitorEmail,
        subject: t.subject || "Offline message",
        messages: [{ sender: "visitor", text: t.message || "", time: new Date() }],
        lastMessage: t.message || t.subject || "",
        lastMessageAt: new Date(),
        read: false,
      });
      return res.status(200).send("ok");
    }

    // Chat events (chat:start / chat:end)
    const chatId = b.chatId || b.chat?.id || null;
    const incoming = [];
    if (b.message && (b.message.text || typeof b.message === "string")) {
      incoming.push({
        sender: b.message?.sender?.type === "agent" ? "agent" : "visitor",
        text: b.message.text || String(b.message),
        time: new Date(b.time || Date.now()),
      });
    }
    if (Array.isArray(b.messages)) {
      for (const m of b.messages) {
        incoming.push({
          sender: m.sender?.type === "agent" ? "agent" : "visitor",
          text: m.msg || m.text || "",
          time: new Date(m.time || Date.now()),
        });
      }
    }

    let chat = chatId ? await SupportChat.findOne({ tawkChatId: chatId }) : null;
    if (!chat) chat = new SupportChat({ tawkChatId: chatId, kind: "chat", visitorName, visitorEmail });
    if (visitorName && visitorName !== "Visitor") chat.visitorName = visitorName;
    if (visitorEmail) chat.visitorEmail = visitorEmail;
    if (incoming.length) {
      chat.messages.push(...incoming);
      chat.lastMessage = incoming[incoming.length - 1].text;
      chat.lastMessageAt = incoming[incoming.length - 1].time;
      chat.read = false;
    }
    if (event === "chat:end") chat.status = "ended";
    await chat.save();
    return res.status(200).send("ok");
  } catch (e) {
    console.error("Tawk webhook error:", e.message);
    return res.status(200).send("ok"); // 200 so Tawk doesn't keep retrying
  }
};

// ── Admin (read-only) ──
const requireAdmin = (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json(new Response(null, "Admins only", 403, "error"));
    return false;
  }
  return true;
};

const listConversations = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const chats = await SupportChat.find().sort({ lastMessageAt: -1 }).limit(200).lean();
    const data = chats.map((c) => ({
      id: c._id,
      visitorName: c.visitorName,
      visitorEmail: c.visitorEmail,
      subject: c.subject,
      lastMessage: c.lastMessage,
      lastMessageAt: c.lastMessageAt,
      messageCount: c.messages?.length || 0,
      status: c.status,
      kind: c.kind,
      read: c.read,
    }));
    return res.json(new Response(data, "Conversations", 200, "success"));
  } catch (e) {
    console.error(e);
    return res.status(500).json(new Response(null, "Error fetching conversations", 500, "error"));
  }
};

const getConversation = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const chat = await SupportChat.findByIdAndUpdate(req.params.id, { read: true }, { new: true }).lean();
    if (!chat) return res.status(404).json(new Response(null, "Conversation not found", 404, "error"));
    return res.json(new Response(chat, "Conversation", 200, "success"));
  } catch (e) {
    console.error(e);
    return res.status(500).json(new Response(null, "Error fetching conversation", 500, "error"));
  }
};

const unreadCount = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const count = await SupportChat.countDocuments({ read: false });
    return res.json(new Response({ count }, "Unread count", 200, "success"));
  } catch (e) {
    console.error(e);
    return res.status(500).json(new Response(null, "Error", 500, "error"));
  }
};

module.exports = { tawkIdentity, webhook, listConversations, getConversation, unreadCount };
