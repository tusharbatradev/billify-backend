const mongoose = require("mongoose");
const Invoice = require("../Models/invoice");
const Customer = require("../Models/customers");
const Product = require("../Models/products");
const Business = require("../Models/business");

async function createInvoice(req, res) {
  try {
    const { businessId, customerId, items, status, issueDate, dueDate } =
      req.body;

    // 🔐 Basic validation
    if (
      !businessId ||
      !customerId ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // 🔐 ObjectId validation
    if (
      !mongoose.Types.ObjectId.isValid(businessId) ||
      !mongoose.Types.ObjectId.isValid(customerId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid businessId or customerId" });
    }

    // 👤 Fetch customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customerSnapshot = {
      customerName: customer.customerName,
      customerPhone: customer.customerPhone,
      customerAddress: customer.customerAddress,
    };

    // 🔍 Validate productIds & quantity
    const productIds = [];
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: "Invalid productId" });
      }
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      productIds.push(item.productId);
    }

    // Fetch all products in ONE query
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res
        .status(404)
        .json({ message: "One or more products not found" });
    }

    const productMap = new Map();
    products.forEach((p) => productMap.set(p._id.toString(), p));

    // Calculate totals
    let subTotal = 0;
    let gstAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      const baseAmount = product.price * item.quantity;
      const gst = (baseAmount * (product.gstRate || 0)) / 100;

      subTotal += baseAmount;
      gstAmount += gst;

      processedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        gstRate: product.gstRate || 0,
        total: baseAmount + gst,
      });
    }

    // Safe invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Create invoice
    const invoice = await Invoice.create({
      businessId,
      customerId,
      customerSnapshot,
      invoiceNumber,
      items: processedItems,
      subTotal,
      gstAmount,
      grandTotal: subTotal + gstAmount,
      status,
      issueDate,
      dueDate,
    });

    return res.status(201).json({
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAllInvoices(req, res) {
  try {
    const { businessId } = req.params;

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(400).json({
        message: "Invalid Business Id",
      });
    }

    const invoices = await Invoice.find({ businessId });

    return res.status(200).json({
      message: "All Invoices fetched Succesfully",
      invoices,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getInvoiceById(req, res) {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ message: "Invalid invoiceId" });
    }

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json({
      message: "Invoice fetched successfully",
      invoice,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteInvoiceById(req, res) {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ message: "Invalid invoiceId" });
    }

    const invoice = await Invoice.findByIdAndDelete(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json({
      message: "Invoice Deleted successfully",
      invoice,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateInvoiceById(req, res) {
  try {
    const { invoiceId } = req.params;
    const { status, issueDate, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ message: "Invalid invoiceId" });
    }

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (status !== undefined) invoice.status = status;
    if (issueDate !== undefined) invoice.issueDate = issueDate;
    if (dueDate !== undefined) invoice.dueDate = dueDate;

    await invoice.save();

    return res.status(200).json({
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  deleteInvoiceById,
  updateInvoiceById,
};
