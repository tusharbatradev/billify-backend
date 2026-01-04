const Customer = require("../Models/customers");
const Business = require("../Models/business");

async function createCustomer(req, res) {
  try {
    const { businessId, customerName, customerPhone, customerAddress } =
      req.body;

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(400).json({
        message: "Invalid Business",
      });
    }

    const customer = await Customer.create({
      businessId,
      customerName,
      customerPhone,
      customerAddress,
    });

    res.status(200).json({
      message: "Customer Added Successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getAllCustomer(req, res) {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({
        message: "Business Id is required",
      });
    }

    const customers = await Customer.find({
      businessId: businessId,
    });

    res.status(200).json({
      message: "Fetched All Customers",
      customers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getCustomerById(req, res) {
  try {
    const { customerId } = req.params;

    let customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(400).json({
        message: "No User Exists",
      });
    }

    res.status(200).json({
      message: "Customer fetched",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteCustomerById(req, res) {
  try {
    const { customerId } = req.params;

    let customer = await Customer.findByIdAndDelete(customerId);

    if (!customer) {
      return res.status(400).json({
        message: "No User Exists",
      });
    }

    res.status(200).json({
      message: "Customer Deleted",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createCustomer,
  getAllCustomer,
  getCustomerById,
  deleteCustomerById,
};
