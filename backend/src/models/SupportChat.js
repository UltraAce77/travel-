const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["visitor", "agent", "system"], default: "visitor" },
    text: { type: String, default: "" },
    time: { type: Date, default: Date.now },
  },
  { _id: false }
);

const supportChatSchema = new mongoose.Schema(
  {
    tawkChatId: { type: String, index: true, default: null },
    kind: { type: String, enum: ["chat", "ticket"], default: "chat" },
    visitorName: { type: String, default: "Visitor" },
    visitorEmail: { type: String, default: "" },
    subject: { type: String, default: "" },
    messages: { type: [messageSchema], default: [] },
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now, index: true },
    status: { type: String, enum: ["active", "ended", "ticket"], default: "active" },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportChat", supportChatSchema);
