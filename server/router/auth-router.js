// routes/auth.js
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");

const router = express.Router();

// -----------------------------
// Load ENV Variables
// -----------------------------
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const JWT_EMAIL_SECRET = process.env.JWT_EMAIL_SECRET || "EMAIL_SECRET_DEV";
const JWT_AUTH_SECRET = process.env.JWT_AUTH_SECRET || "AUTH_SECRET_DEV";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// -----------------------------
// Email Transporter
// -----------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Verify email setup
transporter.verify((err, success) => {
  if (err) console.warn("Nodemailer Error:", err.message);
  else console.log("📧 Email server ready.");
});

// -----------------------------
// GENERATE VERIFICATION CODE
// -----------------------------
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}

// -----------------------------
// SEND VERIFICATION EMAIL
// -----------------------------
async function sendVerificationEmail(toEmail, name, code) {
  const html = `
    <div style="font-family: Arial; color: #333;">
      <h2>Hello ${name || ""},</h2>
      <p>Welcome to <strong>SafaHome</strong>!</p>
      <p>Please verify your email using the code below:</p>
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px;">
        ${code}
      </div>
      <p>This code expires in 10 minutes.</p>
      <hr />
      <small>If you didn't create an account, ignore this email.</small>
    </div>
  `;

  return transporter.sendMail({
    from: `"SafaHome" <${EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify Your Email - SafaHome",
    html,
  });
}

// =========================
//         SIGNUP
// =========================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, role, providerDetails } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit verification code
    const verificationCode = generateVerificationCode();
    const codeExpiry = new Date();
    codeExpiry.setMinutes(codeExpiry.getMinutes() + 10); // Code expires in 10 minutes

    const userData = {
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      verificationCode,
      codeExpiry,
      verified: false,
    };

    if (role === "provider") {
      // Ensure providerDetails has status set to pending
      userData.providerDetails = {
        ...providerDetails,
        status: "pending", // Set initial status to pending
      };
    }

    const user = new User(userData);
    await user.save();

    // Send email
    try {
      await sendVerificationEmail(email, name, verificationCode);
    } catch (err) {
      console.error("Email send failed:", err);
      return res.status(201).json({
        message: "Signup complete but email could not be sent. Please resend.",
        emailSent: false,
      });
    }

    return res.status(201).json({
      message: "Signup successful! Check your email for verification code.",
      emailSent: true,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// =========================
//  OLD TOKEN ROUTE (Backward compatibility - redirects)
// =========================
router.get("/verify/:token", async (req, res) => {
  // Redirect to frontend verify page with message
  return res.redirect(`${FRONTEND_URL}/verify-expired?message=Please use the verification code sent to your email`);
});

// =========================
//     VERIFY CODE
// =========================
router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Check if code matches and is not expired
    if (!user.verificationCode || user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (!user.codeExpiry || new Date() > user.codeExpiry) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Verify the user
    user.verified = true;
    user.verificationCode = null;
    user.codeExpiry = null;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      verified: true,
    });

  } catch (err) {
    console.error("Verify code error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// =========================
//   RESEND VERIFICATION
// =========================
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new verification code
    const newCode = generateVerificationCode();
    const codeExpiry = new Date();
    codeExpiry.setMinutes(codeExpiry.getMinutes() + 10); // Code expires in 10 minutes

    user.verificationCode = newCode;
    user.codeExpiry = codeExpiry;
    await user.save();

    await sendVerificationEmail(email, user.name, newCode);

    return res.json({ message: "Verification code resent successfully" });

  } catch (err) {
    console.error("Resend Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// =========================
//         LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    if (!user.verified) {
      return res.status(401).json({
        message: "Email not verified",
        verified: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_AUTH_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
