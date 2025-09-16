import Product from "../models/Product.js";
import mongoose from "mongoose";
import Fuse from "fuse.js"; 


export const getProducts = async (req, res) => {
  try {
    const { search = "", category = "all", page = 1, limit = 9 } = req.query;


    let query = {};
    if (category !== "all") {
      query.category = category;
    }

    const allProducts = await Product.find(query);
    let filtered = allProducts;

    if (search) {
      const fuse = new Fuse(allProducts, {
        keys: ["name", "description", "category"],
        threshold: 0.4, // 0 = exact, 1 = very fuzzy
      });
      filtered = fuse.search(search).map((r) => r.item);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginated = filtered.slice(startIndex, endIndex);

    res.json({
      products: paginated,
      totalPages: Math.ceil(filtered.length / limit),
    });
  } catch (err) {
    console.error("❌ Error in getProducts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .limit(4)
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching featured products" });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching product" });
  }
};


export const addProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      isFeatured: req.body.isFeatured === true || req.body.isFeatured === "true",
    });
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Error adding product" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const updated = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        isFeatured: req.body.isFeatured === true || req.body.isFeatured === "true",
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting product" });
  }
};

