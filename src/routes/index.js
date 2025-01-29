const express = require("express");
const productRoutes = require("./product.routes");
const userRoutes = require("./user.routes");
const orderRoutes = require("./orders.routes");
const authRoutes = require("./auth.routes");

const router = express.Router();

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/", authRoutes);

module.exports = router;
