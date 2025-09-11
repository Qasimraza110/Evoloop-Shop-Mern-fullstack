import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

//  Get logged-in user's orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // latest first
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get order by Stripe session ID
router.get("/session/:id", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      stripeSessionId: req.params.id,
      user: req.user._id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Get order by session error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

export default router;
