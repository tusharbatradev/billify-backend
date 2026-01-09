const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      unique: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Please enter a valid email address",
      ],
    },

    phoneNumber: {
      type: String, // 🔥 String rakho (leading zero + length safe)
      required: [true, "Phone number is required"],
      unique: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit Indian phone number",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    logo: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    gstNumber: {
      type: String,
      uppercase: true,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GST number format",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
