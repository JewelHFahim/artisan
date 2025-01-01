const express = require("express");
const {
  handleGetProduct,
  handleCreateProduct,
  handleGetSingleProduct,
  handleDeleteProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", handleGetProduct);
router.post("/", handleCreateProduct);
router.get("/:id", handleGetSingleProduct);
router.delete("/:id", handleDeleteProduct);

module.exports = router;
