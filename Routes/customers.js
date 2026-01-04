const customerController = require("../Controllers/customers");
const express = require("express");
const customerRouter = express.Router();

customerRouter.post("/addCustomer", customerController.createCustomer);
customerRouter.get("/:businessId", customerController.getAllCustomer);
customerRouter.get("/single/:customerId", customerController.getCustomerById);
customerRouter.delete("/delete/:customerId", customerController.deleteCustomerById);

module.exports = customerRouter;
