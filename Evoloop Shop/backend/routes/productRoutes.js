
import express from "express";
import Product from "../models/Product.js";
import {
  getProducts,
  getFeaturedProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
   
    if (!categories || categories.length === 0) {
      return res.json([
        "clothes",
        "electronics",
        "accessories",
        "shoes",
        "home", 
        "mobiles",
      ]);
    }
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: err.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;

