const express = require("express");
const productRoutes = require("./product.routes");
const userRoutes = require("./user.routes");

const router = express.Router();

router.use("/products", productRoutes);
router.use("/users", userRoutes);

module.exports = router;
