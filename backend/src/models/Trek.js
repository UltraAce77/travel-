const mongoose = require("mongoose");

const trekSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true },
    commission: { type: Number, required: true },
    picture: { type: Buffer, default: null },
    imageUrl: { type: String, default: null },
    imageSource: { type: String, default: null },
    catalogManaged: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trek", trekSchema);
