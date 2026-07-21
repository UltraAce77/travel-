const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    trekId: { type: mongoose.Schema.Types.ObjectId, ref: "Trek", required: true },
    price: { type: Number, required: true },
    commission: { type: Number, default: null },
    status: { type: String, enum: ["pending", "completed"], default: "pending", index: true },
    rating: { type: Number, min: 1, max: 5, default: null },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    archived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

assignmentSchema.index({ userId: 1, archived: 1, status: 1, createdAt: 1 });
module.exports = mongoose.model("Assignment", assignmentSchema);
