const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
    quantity: { type: Number, required: true },
    // price: { type: Number, required: true },
    size: {type: Number, required: true},
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [orderItemSchema],
    total_price: { type: Number, required: true },
    delivery_charge: { type: Number, required: true },
    delivery_address: { type: String, required: true },
    contact_phone: { type: String, required: true },
    payment_method: { type: String, required: true },
    payment_details: {
      payment_number: { type: String },
      transaction_id: { type: String },
    },
    order_status: {
      type: String, 
      enum: ["pending", "delivered", "cancelled"], 
      default: "pending"
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
