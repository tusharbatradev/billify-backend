const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Business = mongoose.model("Business", businessSchema);
module.exports = Business;
