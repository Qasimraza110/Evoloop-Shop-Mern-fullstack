import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  createShipping, 
  getShippingByOrder, 
  getAllShippings,
  getCurrentUserShipping,
  updateShipping
} from "../controllers/shippingController.js";

const router = express.Router();

// ✅ User can create shipping after order
router.post("/", protect, createShipping);

// ✅ Get shipping by orderId
router.get("/:orderId", protect, getShippingByOrder);

// ✅ Admin get all shippings
router.get("/", protect, getAllShippings);
router.get("/user/me", protect, getCurrentUserShipping);
router.put("/:id", protect, updateShipping);


export default router;
