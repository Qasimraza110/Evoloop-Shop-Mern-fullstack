import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

// ✅ Create Stripe checkout session
router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Missing items" });
    }

    // Stripe line_items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    });

    // ✅ Save order
    const order = await Order.create({
      user: req.user._id, // 👈 required field
      items,
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      stripeSessionId: session.id,
      status: "pending",
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ message: "Payment failed" });
  }
});

export default router;
