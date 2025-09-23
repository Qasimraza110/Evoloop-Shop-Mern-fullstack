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

router.post("/", protect, createShipping);

router.get("/:orderId", protect, getShippingByOrder);

router.get("/", protect, getAllShippings);
router.get("/user/me", protect, getCurrentUserShipping);
router.put("/:id", protect, updateShipping);


export default router;

