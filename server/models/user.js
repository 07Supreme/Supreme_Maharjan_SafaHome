const mongoose = require("mongoose");

const providerDetailsSchema = new mongoose.Schema({
  serviceType: { type: String, enum: ["cleaning", "plumbing", "painting", "electrical"] },
  experience: String,
  phone: String,
  address: String,
  citizenship: String,

  // updated status
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  pricing: {
    cleaning: { type: Number, default: 0 },
    plumbing: { type: Number, default: 0 },
    painting: { type: Number, default: 0 },
    electrical: { type: Number, default: 0 }
  }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "provider", "admin", "staff"],
      default: "user",
    },

    providerDetails: providerDetailsSchema,

    verified: { type: Boolean, default: false },
    verificationToken: String, // Keep for backward compatibility
    verificationCode: String,
    codeExpiry: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
