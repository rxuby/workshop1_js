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
    let orders;
    if (req.user.role === "admin") { 
      // admin ดูได้ทุก order
      orders = await Order.find().populate("buyer").populate("items.productId"); // ดึง user ที่ซื้อ กับ ข้อมูลสินค้า
    } else {
      orders = await Order.find({ buyer: req.user.id }) // user ดูได้เฉพาะ order ตัวเอง
        .populate("buyer", "username firstname lastname") // ดึงแค่ฟิลด์ที่จะแสดง
        .populate("items", "code name price");
      // .populate("items.productId", "code name price");
    }
    res.json(orders); // ส่ง order กลับ
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    // const order = await Order.findById(req.params.id)
    //   .populate("buyer")
    //   .populate("items.productId");
    let orderQuery = Order.findById(req.params.id); // สร้าง query ก่อน
    if (req.user.role === "admin") {
      orderQuery = orderQuery.populate("buyer").populate("items.productId");
    } else {
      orderQuery = orderQuery
        .populate("buyer", "username firstname lastname")
        .populate("items", "code name price");
      // .populate("items.productId", "code name price");
    }

    const order = await orderQuery;

    if (!order) return res.status(404).json({ message: "Order not found" });

    // ไม่ให้ user ดู order ของคนอื่น
    if (
      req.user.role !== "admin" &&
      order.buyer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not your order" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  // สร้าง order
  const { items } = req.body;
  let totalPrice = 0;
  const arrItems = [];

  // ลูปเช็ค stock จ้าตัวเอง
  for (let item of items) {
    // const product = await Product.findById(item.productId);
    const product = await Product.findOne({ code: item.productCode });

    // เช็คว่ามีของมั้ยหรือที่ลูกค้าสั่งมีมากกว่าที่มีใน stock
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ message: "Stock not enough" });
    }

    const linePrice = product.price * item.quantity;
    totalPrice += linePrice;

    // หัก stock
    product.stock -= item.quantity;
    await product.save();

    // เก็บสินค้าที่ user เลือกลง array ใหม่
    arrItems.push({
      productId: product._id,
      productCode: product.code,
      quantity: item.quantity,
      price: linePrice,
    });
  }

  // สร้าง order ลง db
  const order = await Order.create({
    orderCode: genOrderCode(),
    items: arrItems,
    buyer: req.user.id,
    totalPrice,
  });

  res.json(order);
};
