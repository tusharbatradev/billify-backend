const express = require("express");
const cors = require("cors");
const { connectDb } = require("./config/connectDb");
const businessRouter = require("./Routes/business");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const auth = require("./Middlewares/auth");
const productRouter = require("./Routes/products");
const customerRouter = require("./Routes/customers");
const InvoiceRouter = require("./Routes/invoice");

const app = express();

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};

// Database Connection
connectDb();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOption));

// Routes
app.use("/user", businessRouter);
app.use("/product", auth, productRouter);
app.use("/customer", auth, customerRouter);
app.use("/invoice", auth, InvoiceRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
