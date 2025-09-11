import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { items, total, shipping, stripeSessionId } = req.body;

    if (!items || !total || !shipping || !stripeSessionId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = await Order.create({
      user: req.user._id,
      items,
      total,
      shipping,
      stripeSessionId,
      paymentStatus: "Paid"
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Create order error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};