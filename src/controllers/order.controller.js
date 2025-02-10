const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

// Create Order
async function handleCreateOrder(req, res) {
  const {
    user_id,
    products,
    total_price,
    delivery_charge,
    delivery_address,
    contact_phone,
    payment_method,
    payment_details,
  } = req.body;

  try {
    // Validate required fields
    if (!products || !user_id || !total_price || !delivery_address || !contact_phone || !payment_method) {
      return res.status(400).json({
        status: false,
        message: "Please fill in all required fields.",
      });
    }

    // Additional validation for payment details
    if (
      (payment_method === "Bkash" || payment_method === "Nagad") &&
      (!payment_details?.payment_number || !payment_details?.transaction_id)
    ) {
      return res.status(400).json({
        status: false,
        message: "Payment details are required for Bkash or Nagad payment methods.",
      });
    }

    // Validate all products and check stock
    const productIds = products.map((p) => p.product_id);
    const productDocs = await Product.find({ _id: { $in: productIds } });

    if (productDocs.length !== products.length) {
      return res.status(404).json({ status: false, message: "One or more products were not found.",
      });
    }

    for (const product of products) {
      const matchedProduct = productDocs.find((p) => p._id.toString() === product.product_id);
      if (matchedProduct.stock < product.quantity) {
        return res.status(400).json({
          status: false,
          message: `Insufficient stock for product: ${matchedProduct.title}`,
        });
      }
    }

    // Create order items and reduce stock
    const orderItems = [];
    for (const product of products) {
      const matchedProduct = productDocs.find((p) => p._id.toString() === product.product_id);

      orderItems.push({
        product_id: product.product_id,
        // title: matchedProduct.title,
        size: product.size,
        quantity: product.quantity,
        // price: product.price,
      });

      // Deduct stock
      matchedProduct.stock -= product.quantity;
    }

    // Save updated products
    await Promise.all(productDocs.map((p) => p.save()));

    // Calculate final total price (including delivery charge)
    const finalTotalPrice = total_price + delivery_charge;

    // Create order
    const order = await Order.create({
      user_id,
      products: orderItems,
      total_price: finalTotalPrice,
      delivery_charge,
      delivery_address,
      contact_phone,
      payment_method,
      payment_details,
    });

    return res.status(201).json({
      status: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Order creation error: ", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
}

// Get all orders
async function handleGetAllOrdersAdmin(req, res){
  try {
    const orders = await Order.find({});

    if(!orders) return res.status(404).json({status: false, message: "Orders not found"});

    return res.status(200).json({status: true, message: "Orders found", data: orders})
  } catch (error) {
    console.log("Fetching orders failed:", error);
    return res.status(500).json({status: false, message: "Fetching orders failed:", error})
  }
}

// Single order
async function handleGetSingleOrder(req, res){
  const orderId = req.params.id;

  try {
    if(!orderId) return res.status(404).json({status: false, message: "Order not found"});

    const order = await Order.findById({_id: orderId})
    .populate({path: "products.product_id", model: Product, select: "title colors sale_price"})
    .populate({path: "user_id", model: User, select:"fullName phone address"});

    if(!order) return res.status(404).json({status: false, message: "Order not found"});

    return res.status(200).json({status: true, message: "Order found", data: order})
    
  } catch (error) {

    console.log("Fetching order failed:", error);

    return res.status(500).json({status: false, message: "Fetching order failed:", error})
  }
}

// Single User Orders
async function handleGetUserOrders(req, res) {
  const id  = req.params.id

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

   const orders = await Order.find({user_id: id}).populate({path: 'user_id', select: 'fullName'}).skip(skip).limit(limit).sort({createdAt: - 1});

   const totalOrders = await Order.countDocuments({user_id: id});

   const totalPage = Math.ceil(totalOrders / limit);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ status: false, message: "Orders not found", orders:[]});
    }
    return res.status(200).json({ status: true, message: "Orders found", data: orders, 
      
      totalOrders, totalPage, currentPage: page
      
    });

  } catch (error) {
    console.error("Fetching orders failed:", error);

    return res.status(500).json({ status: false, message: "Fetching orders failed", error: error.message,});
  }
}

module.exports = { handleCreateOrder, handleGetAllOrdersAdmin, handleGetSingleOrder, handleGetUserOrders };
