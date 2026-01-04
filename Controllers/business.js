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

    // Check if business already exists
    const existingBusiness = await Business.findOne({
      $or: [{ businessName }, { email }, { phoneNumber }],
    });

    if (existingBusiness) {
      return res.status(409).json({
        message: "Business already exists with given details",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create business
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Email and password are required",
      });
    }

    // Check if email exists in DB
    const business = await Business.findOne({email});

    if (!business) {
      return res.status(404).json({
        msg: "Email is not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      return res.status(401).json({
        msg: "Invalid password",
      });
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
      token,
      business
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createBusiness,
  loginBusiness,
};
