const express = require("express");

const router = express.Router();

const {
  handleCreateOrder,
  handleGetAllOrdersAdmin,
  handleGetSingleOrder,
  handleGetUserOrders,
} = require("../controllers/order.controller");

router.post("/", handleCreateOrder);
router.get("/", handleGetAllOrdersAdmin);
router.get("/my_orders/:id", handleGetUserOrders);
router.get("/:id", handleGetSingleOrder);


module.exports = router;


