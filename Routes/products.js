const express = require("express");
const productController = require("../Controllers/products");

const productRouter = express.Router();

productRouter.post("/addProduct", productController.addProduct);
productRouter.get("/business/:businessId", productController.getAllProducts);
productRouter.get("/single/:productId", productController.getProductById);
productRouter.put("/update/:productId", productController.updateProduct);

module.exports = productRouter;
