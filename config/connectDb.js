const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB Connected");
  } catch (error) {
    console.log("Cannot Connect to DB");
  }
}

module.exports = { connectDb };
