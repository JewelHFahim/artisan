const express = require("express");
const {
  handleGetProduct,
  handleCreateProduct,
  handleGetSingleProduct,
  handleDeleteProduct,
  handleUpdateProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", handleGetProduct);
router.post("/", handleCreateProduct);
router.get("/:id", handleGetSingleProduct);
router.put("/:id/update", handleUpdateProduct);
router.delete("/:id", handleDeleteProduct);

module.exports = router;
