const Product = require("../Models/products");
const mongoose = require("mongoose");

async function addProduct(req, res) {
  try {
    const { businessId, name, description, price, gstRate, unit, stock } =
      req.body;

    // 🔍 Basic validation
    if (!businessId || !name || price === undefined) {
      return res.status(400).json({
        message: "businessId, name and price are required",
      });
    }

    // 🔍 Validate businessId
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({
        message: "Invalid Business Id",
      });
    }

    // 🔍 CHECK: Same product name already exists for this business
    const existingProduct = await Product.findOne({
      businessId: new mongoose.Types.ObjectId(businessId),
      name: name.trim(),
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "Product with this name already exists for this business",
      });
    }

    // ✅ Create product
    const product = await Product.create({
      businessId: new mongoose.Types.ObjectId(businessId),
      name: name.trim(),
      description,
      price,
      gstRate,
      unit,
      stock,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getAllProducts(req, res) {
  try {
    const { businessId } = req.params;

    // 🔍 Validate businessId
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({
        message: "Invalid Business Id",
      });
    }

    // ✅ Find products for the business
    const products = await Product.find({
      businessId: new mongoose.Types.ObjectId(businessId),
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getProductById(req, res) {
  try {
    const { productId } = req.params;

    // 🔍 Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid Product Id",
      });
    }

    // ✅ Find product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateProduct(req, res) {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    // 🔍 Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid Product Id",
      });
    }

    // ❌ Prevent businessId update (important)
    if (updateData.businessId) {
      delete updateData.businessId;
    }

    // ✅ Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
};
