const jwt = require("jsonwebtoken");
const User = require("../Models/business");

async function auth(req, res, next) {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.status(200).json({ msg: "Not Authorised" });
    }

    jwt.verify(token, "secretKey123");

    next();
  } catch (error) {
    res.status(400).json({ msg: "error in authorization", error: error });
  }
}

module.exports = auth;
