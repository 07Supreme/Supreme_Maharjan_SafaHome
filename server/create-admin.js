/*const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const connectDB = require("./config/db");

connectDB();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("123456", 10);
  const admin = new User({
    name: "Supreme Admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    phone: "9823354833",
    role: "admin",
    isVerified: true,
  });

  await admin.save();
  console.log("✅ Admin created successfully");
  mongoose.connection.close();
}

createAdmin();*/
