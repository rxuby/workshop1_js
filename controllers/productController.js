const Product = require("../models/Product");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

exports.uploadImage = upload.single("image");

exports.getAll = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

exports.create = async (req, res) => {
  // const product = await Product.create(req.body);
  // res.json(product);
  try {
    const { code, name, description, price, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const product = await Product.create({
      code,
      name,
      description,
      price: Number(price),
      stock: Number(price),
      image,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  // const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true, // คืนค่าหลังอัปเดต
  // });
  // res.json(product);
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.price) updateData.stock = Number(updateData.stock);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
