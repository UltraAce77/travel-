const mongoose = require("mongoose");
const trekSchema = new mongoose.Schema({ title: { type: String, required: true, trim: true }, price: { type: Number, required: true }, commission: { type: Number, required: true }, picture: { type: Buffer, default: null } }, { timestamps: true });
module.exports = mongoose.model("Trek", trekSchema);