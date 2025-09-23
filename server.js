const app = require("./app");
const User = require("./models/User.js");
const bcrypt = require("bcrypt");
require("dotenv").config();
const main = require("./db.js");
const port = process.env.PORT || 5000;

const createDefaultAdmin = async () => {
  const admin = await User.findOne({ role: "admin" });
  const adminUser = process.env.DEFAULT_ADMIN_USER;
  const adminPass = process.env.DEFAULT_ADMIN_PASS;
  if (!admin) {
    const hashed = await bcrypt.hash(adminPass, 10);
    await User.create({
      username: adminUser,
      password: hashed,
      firstname: "admin",
      lastname: "admin",
      gender: "male",
      age: 20,
      role: "admin",
    });
    console.log("Default admin create");
  }
};

main().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    createDefaultAdmin();
  });
}).catch((error) => {
  console.error("Failed to connect to the database", error);
});
