const { default: mongoose, model } = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    sale_price: {
      type: Number,
      required: true,
    },

    discount_price: {
      type: String,
    },

    colors: {
      type: [String],
      required: true,
    },

    sizes: {
      type: [Number],
    },

    quantity: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      required: true,
    },

    current_status: {
      type: String,
      enum: ["sale", "out"],
      default: "sale",
    },
  },

  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
