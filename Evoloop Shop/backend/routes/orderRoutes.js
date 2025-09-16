import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, getAllOrders, updateOrderStatus,getMyOrders } from "../controllers/orderController.js";
import Order from "../models/Order.js";

const router = express.Router();


router.post("/", createOrder);

router.get("/all", getAllOrders);

router.put("/:id/status", updateOrderStatus);

router.get("/", protect, getMyOrders);

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

