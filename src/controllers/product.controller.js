const Product = require("../models/product.model");

// create a new product
async function handleCreateProduct(req, res, next) {
  try {
    const {
      title,
      sale_price,
      discount_price,
      colors,
      sizes,
      quantity,
      description,
      sku,
    } = req.body;

    const product = new Product({
      title,
      sale_price,
      discount_price,
      colors,
      sizes,
      quantity,
      description,
      sku,
    });

    if (!title || !sale_price || !colors || !quantity || !description || !sku) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const newProduct = await Product.create(product);

    res
      .status(201)
      .json({ status: true, message: "Product created", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
    next(error);
  }
}

// get all products
async function handleGetProduct(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);

    if (!products) {
      return res.status(404).json({ error: "No product found" });
    }

    const totalCount = await Product.countDocuments();
    const totalPage = Math.ceil(totalCount / limit);

    res.status(200).json({
      status: true,
      message: "Prodducts found",
      data: products,
      pagination: { currentPage: page, totalPage, totalCount, limit },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
    next(error);
  }
}

// single product
async function handleGetSingleProduct(req, res, next) {
  try {
    const productId = req.params.id;

    if (!productId)
      return res
        .status(400)
        .json({ status: false, message: "Product ID is required" });

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "Product found", data: product });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
    next(error);
  }
}

// delete product
async function handleDeleteProduct(req, res, next) {
  try {
    const productId = req.params.id;

    if (!productId)
      return res
        .status(400)
        .json({ status: false, message: "Product ID is required" });

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "Product deleted", data: product._id });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
    next(error);
  }
}

module.exports = {
  handleGetProduct,
  handleCreateProduct,
  handleGetSingleProduct,
  handleDeleteProduct,
};
