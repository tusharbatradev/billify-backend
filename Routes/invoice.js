const express = require("express");
const { createInvoice, getAllInvoices, getInvoiceById, deleteInvoiceById, updateInvoiceById } = require("../Controllers/invoice");
const InvoiceRouter = express.Router();

InvoiceRouter.post("/create", createInvoice);
InvoiceRouter.get("/:businessId", getAllInvoices);
InvoiceRouter.get("/single/:invoiceId", getInvoiceById);
InvoiceRouter.delete("/delete/:invoiceId", deleteInvoiceById);
InvoiceRouter.put("/update/:invoiceId", updateInvoiceById);

module.exports = InvoiceRouter;
