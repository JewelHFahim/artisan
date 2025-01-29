const express = require("express");
const { handleResetPassword, handleSubmitNewPass } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/request-password-reset", handleResetPassword);
router.post("/reset-password/:token", handleSubmitNewPass);


module.exports = router;