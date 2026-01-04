const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
    index: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian phone number",
    ],
  },
  customerAddress: {
    type: String,
    required: true,
  },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
