import express from "express";
import path from "path";
import multer from "multer";
import Product from "../models/Product.js";
import {
  getProducts,
  getFeaturedProducts,
  updateProduct,
  deleteProduct, 
  getAllProductsForInventory,
} from "../controllers/productController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

router.get("/", getProducts);
router.get("/inventory", getAllProductsForInventory);
router.get("/featured", getFeaturedProducts);
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, stock, category, isFeatured } = req.body;

    const newProduct = new Product({
      name,
      price: Number(price),
      description,
      stock: Number(stock),
      category,
      isFeatured: isFeatured === "true",
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct); // return new product for live update
  } catch (err) {
    console.error("❌ Failed to add product:", err);
    res.status(500).json({ message: "Failed to add product", error: err.message });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, stock, category, isFeatured } = req.body;

    const updatedData = {
      name,
      price: Number(price),
      description,
      stock: Number(stock),
      category,
      isFeatured: isFeatured === "true",
    };

    if (req.file) updatedData.image = `/uploads/${req.file.filename}`;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json(updatedProduct);
  } catch (err) {
    console.error("❌ Failed to update product:", err);
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete product:", err);
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
});


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
    console.error("❌ Failed to fetch categories:", err);
    res.status(500).json({ message: "Failed to fetch categories", error: err.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;