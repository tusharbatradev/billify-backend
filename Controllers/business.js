const Business = require("../Models/business");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createBusiness(req, res) {
  try {
    const {
      businessName,
      email,
      phoneNumber,
      password,
      address,
      logo,
      gstNumber,
    } = req.body;

    // validation
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const business = await Business.create({
      businessName,
      email,
      phoneNumber,
      password: hashedPassword,
      address,
      logo,
      gstNumber,
    });

    res.status(201).json({
      message: "Business created successfully",
      business,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function loginBusiness(req, res) {
  try {
    const { businessName, password } = req.body;

    if (!businessName || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const business = await Business.findOne({ businessName });

    if (!business) {
      return res.status(400).json({ msg: "Business not found" });
    }

    const isMatch = await bcrypt.compare(password, business.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ id: business._id }, process.env.secretKey, {
      expiresIn: "5d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: "Business logged in successfully",
      business,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createBusiness,
  loginBusiness,
};
