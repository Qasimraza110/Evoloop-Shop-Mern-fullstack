import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/userController.js";

const router = express.Router();

// 👤 User profile
router.get("/profile", protect, getProfile);

// 👥 Admin: get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;
