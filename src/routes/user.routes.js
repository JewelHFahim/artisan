const express = require("express");

const router = express.Router();

const {
  handleCreateUser,
  handleGetUsers,
  handleGetSingleUser,
  handleDeleteUser,
  handleUpdateUser,
  handleLoginUser,
  handleLogoutUser,
} = require("../controllers/user.controller");
const { restrictUserTo } = require("../middlewares/auth.middleware");

router.post("/signup", handleCreateUser);
router.post("/login", handleLoginUser);
router.post("/logout", handleLogoutUser);
router.get("/", handleGetUsers);
router.get("/:id", handleGetSingleUser);
router.delete("/:id", restrictUserTo(["admin"]), handleDeleteUser);
router.put("/:id/update", restrictUserTo(["admin"]), handleUpdateUser);

module.exports = router;
