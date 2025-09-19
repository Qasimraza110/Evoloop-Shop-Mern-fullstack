import Product from "../models/Product.js";
import mongoose from "mongoose";
import Fuse from "fuse.js";

// Get all products with search & pagination
export const getProducts = async (req, res) => {
  try {
    const { search = "", category = "all", page = 1, limit = 9 } = req.query;

    let query = {};
    if (category !== "all") query.category = category;

    const allProducts = await Product.find(query);
    let filtered = allProducts;

    if (search) {
      const fuse = new Fuse(allProducts, {
        keys: ["name","description","category"],
        threshold: 0.4,
      });
      filtered = fuse.search(search).map(r => r.item);
    }

    const start = (page-1)*limit;
    const end = start + parseInt(limit);
    const paginated = filtered.slice(start,end);

    res.json({ products: paginated, totalPages: Math.ceil(filtered.length/limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get featured products
export const getFeaturedProducts = async (req,res) => {
  try {
    const products = await Product.find({ isFeatured:true }).limit(4).sort({createdAt:-1});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message:"Server error fetching featured products" });
  }
};

// Add product
export const addProduct = async (req,res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message:"Name, price, and category are required" });
    }

    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock) || 0,
      isFeatured: req.body.isFeatured === "true" || req.body.isFeatured === true,
    };

    if (req.file) productData.image = `/uploads/${req.file.filename}`;

    const product = new Product(productData);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message:"Failed to save product", error:err.message });
  }
};

// Update product
export const updateProduct = async (req,res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message:"Invalid product ID" });

    const updateData = {
      ...req.body,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock) || 0,
      isFeatured: req.body.isFeatured === "true" || req.body.isFeatured === true,
    };

    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updated = await Product.findByIdAndUpdate(id, updateData, { new:true });
    if (!updated) return res.status(404).json({ message:"Product not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message:"Failed to update product", error:err.message });
  }
};

// Delete product
export const deleteProduct = async (req,res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message:"Invalid product ID" });

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message:"Product not found" });

    res.json({ message:"Product removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:"Server error deleting product" });
  }
};

export const getAllProductsForInventory = async (req, res) => {
  try {
    const products = await Product.find(); 
    res.json(products);
  } catch (err) {
    console.error("❌ Failed to fetch products for inventory:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
