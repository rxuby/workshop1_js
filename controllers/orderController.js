const Order = require("../models/Order");
const Product = require("../models/Product");

function genOrderCode() {
  // gen order code
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${ts}-${rand}`;
}

exports.getAll = async (req, res) => {
  //   const orders = await Order.find()
  //     .populate("buyer")
  //     .populate("items.productId");
  //   res.json(orders);
  // };

  try {
    const orders = await Order.find()
      .populate("buyer")
      .populate("items.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer")
      .populate("items.productId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const { items, buyer } = req.body; 
  let totalPrice = 0;
  const arrItems = [];

  for (let item of items) {
    const product = await Product.findOne({ code: item.productCode });
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ message: "Stock not enough" });
    }

    const linePrice = product.price * item.quantity;
    totalPrice += linePrice;

    product.stock -= item.quantity;
    await product.save();

    arrItems.push({
      productId: product._id,
      productCode: product.code,
      quantity: item.quantity,
      price: linePrice,
    });
  }

  const order = await Order.create({
    orderCode: genOrderCode(),
    items: arrItems,
    buyer, 
    totalPrice,
  });

  res.json(order);
};
