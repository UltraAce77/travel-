const mongoose = require("mongoose");
const assignmentSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, trekId: { type: mongoose.Schema.Types.ObjectId, ref: "Trek", required: true }, price: { type: Number, required: true }, commission: { type: Number, default: null }, status: { type: String, enum: ["pending", "completed"], default: "pending", index: true } }, { timestamps: true });
assignmentSchema.index({ userId: 1, status: 1 });
module.exports = mongoose.model("Assignment", assignmentSchema);