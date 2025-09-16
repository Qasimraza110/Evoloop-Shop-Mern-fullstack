import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, getAllOrders, updateOrderStatus,getMyOrders } from "../controllers/orderController.js";
import Order from "../models/Order.js";

const router = express.Router();

// 🛒 User creates order
// Create order
router.post("/", createOrder);

// Admin: get all orders
router.get("/all", getAllOrders);

// Admin: update order status
router.put("/:id/status", updateOrderStatus);

// 👤 User orders
router.get("/", protect, getMyOrders);

// 🔎 Find order by Stripe session
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
