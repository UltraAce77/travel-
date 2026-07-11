const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
   userName: { type: String, required: true, trim: true, unique: true },
   email: { type: String, required: true, trim: true, lowercase: true, unique: true },
   password: { type: String, required: true, select: false },
   role: { type: String, enum: ["admin", "manager", "user"], default: "user", index: true },
   referralCode: { type: String, default: null, index: true },
   active: { type: Boolean, default: true, index: true },
   withdrawCode: { type: String, default: null },
   referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
   record: { totalBalance: { type: Number, default: 0 }, completedTreks: { type: Number, default: 0 }, completedTravel: { type: Number, default: 0 }, commission: { type: Number, default: 0 }, cryptoAddress: { type: String, default: null } },
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);