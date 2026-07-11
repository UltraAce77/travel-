const mongoose = require("mongoose");
const fundSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, balance: { type: Number, required: true }, status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" } }, { timestamps: true });
module.exports = mongoose.model("Fund", fundSchema);