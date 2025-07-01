const express = require("express");
const authController = require("../controllers/authController");
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  checkOTP,
  protect,
  checkAvailability,
} = authController;
const router = express.Router();
router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/forgot-password", forgotPassword);
router.post("/check-otp", checkOTP);
router.patch("/reset-password", resetPassword);
router.get("/token-status", protect);
router.post("/check-availability", checkAvailability);
module.exports = router;
