const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: String,
});

module.exports = mongoose.model("Product", productSchema);
