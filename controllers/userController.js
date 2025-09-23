const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getAll = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.getAllById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

exports.create = async (req, res) => {
  const { username, password, firstname, lastname, gender, age, role } =
    req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    password: hashed,
    firstname,
    lastname,
    gender,
    age,
    role,
  });
  res.json(user);
};

exports.update = async (req, res) => {
  const { password, ...rest } = req.body;
  if (password) rest.password = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true });
  res.json(user);
};

exports.delete = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
