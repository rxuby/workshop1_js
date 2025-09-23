const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        productCode: { type: String },
        quantity: Number,
        price: Number,
      },
    ],
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    totalPrice: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
