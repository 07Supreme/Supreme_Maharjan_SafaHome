const express = require("express");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const router = express.Router();

// Email variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
});

// ---------------------------
// GET ALL PROVIDERS (PENDING)
// ---------------------------
router.get("/providers", async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" });
    res.json(providers);
  } catch (err) {
    console.error("Error fetching providers:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// APPROVE PROVIDER
// ---------------------------
router.put("/approve/:id", async (req, res) => {
  try {
    const { cleaning, plumbing, painting, electrical } = req.body;

    const provider = await User.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    provider.providerDetails.status = "approved";
    provider.providerDetails.pricing = { cleaning, plumbing, painting, electrical };

    await provider.save();

    await transporter.sendMail({
      from: `"SafaHome" <${EMAIL_USER}>`,
      to: provider.email,
      subject: "Provider Approved",
      html: `<h2>Hello ${provider.name}</h2><p>Your provider account is approved!</p>`
    });

    res.json({ message: "Provider approved" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// REJECT PROVIDER
// ---------------------------
router.put("/reject/:id", async (req, res) => {
  try {
    const provider = await User.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    provider.providerDetails.status = "rejected";
    await provider.save();

    await transporter.sendMail({
      from: `"SafaHome" <${EMAIL_USER}>`,
      to: provider.email,
      subject: "Provider Application Rejected",
      html: `<h2>Hello ${provider.name}</h2><p>We regret to inform your application has been rejected.</p>`
    });

    res.json({ message: "Provider rejected" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// GET ALL STAFF AND PROVIDERS
// ---------------------------
router.get("/staff", async (req, res) => {
  try {
    // Get both staff and providers (all non-user roles)
    const staff = await User.find({ 
      role: { $in: ["staff", "provider", "admin"] } 
    });
    res.json(staff);
  } catch (err) {
    console.error("Error fetching staff:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// GET ALL SERVICE PROVIDERS
// ---------------------------
router.get("/service-providers", async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" });
    res.json(providers);
  } catch (err) {
    console.error("Error fetching service providers:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// ADD STAFF
// ---------------------------
router.post("/add-staff", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "staff",
      verified: true
    });

    await staff.save();

    res.json({ message: "Staff added successfully" });

  } catch (err) {
    console.error("Error adding staff:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// JOB TRACKING - EXAMPLE
// ---------------------------
router.get("/jobs", async (req, res) => {
  res.json([]); // You will add job model later
});

module.exports = router;
