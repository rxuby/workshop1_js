// จัดการเรื่อง register login
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { username, password, firstname, lastname, gender, age } = req.body; // รับค่าจาก body  
    const hashed = await bcrypt.hash(password, 10); // hash pwd

    const user = await User.create({ // สร้าง new user
      username,
      password: hashed,
      firstname,
      lastname,
      gender,
      age,
      role: "user", // fixed role
    });

    res.json({ message: "Registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.registerAdmin = async (req, res) => {};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body; // รับค่าจาก body 
    const user = await User.findOne({ username }); // หา user จาก username
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password); //
    if (!match) return res.status(400).json({ message: "Password incorrect" });

    const token = jwt.sign( // jwt sign ใน token จะมี id กับ role
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
