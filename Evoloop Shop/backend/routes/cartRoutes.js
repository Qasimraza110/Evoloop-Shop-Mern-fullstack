import express from "express";
import { getCart, updateCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import Cart from "../models/Cart.js";  

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, updateCart);


router.delete("/clear", protect, async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id }); 
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

export default router;
