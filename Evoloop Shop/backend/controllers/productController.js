import Product from "../models/Product.js";


export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;   
    const limit = parseInt(req.query.limit) || 12; 

    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      totalPages,
      currentPage: page,
      totalProducts,
    });
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({ message: "Server error while fetching product" });
  }
};
