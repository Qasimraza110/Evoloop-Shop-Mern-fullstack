import express from "express";
import {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
   verifyOtp,
   forgotPassword,
   resetPassword,
   verifyOtpReset

} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

// Profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);        
router.put("/change-password", protect, changePassword); 

router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp-reset", verifyOtpReset);
router.post("/reset-password", resetPassword);
export default router;
