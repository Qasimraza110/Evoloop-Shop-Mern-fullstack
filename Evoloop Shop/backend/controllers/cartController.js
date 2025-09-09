
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || !cart.items || cart.items.length === 0) return res.json([]);

    const enriched = await Promise.all(
      cart.items.map(async (it) => {
        const prod = await Product.findById(it._id).lean();
        return {
          _id: it._id,
          name: prod?.name ?? it.name,
          price: typeof prod?.price === "number" ? prod.price : it.price,
          image: prod?.image ?? it.image ?? "",
          quantity: it.quantity,
          stock: typeof prod?.stock === "number" ? prod.stock : 0,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ message: "Server error while fetching cart" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: "Invalid items" });

    // Validate against product stock
    for (const it of items) {
      const prod = await Product.findById(it._id);
      if (!prod) return res.status(404).json({ message: `Product ${it._id} not found` });
      if (it.quantity > prod.stock) {
        return res.status(400).json({
          message: `❌ Only ${prod.stock} items available in stock for ${prod.name}`,
        });
      }
    }

    // persist (upsert)
    let cart = await Cart.findOne({ userId: req.user._id });
    const snapshot = items.map((it) => ({
      _id: it._id,
      name: it.name ?? "",
      price: it.price ?? 0,
      quantity: it.quantity,
    }));

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: snapshot });
    } else {
      cart.items = snapshot;
    }
    await cart.save();

    // return enriched response (same shape as GET)
    const enriched = await Promise.all(
      cart.items.map(async (it) => {
        const prod = await Product.findById(it._id).lean();
        return {
          _id: it._id,
          name: prod?.name ?? it.name,
          price: typeof prod?.price === "number" ? prod.price : it.price,
          image: prod?.image ?? it.image ?? "",
          quantity: it.quantity,
          stock: typeof prod?.stock === "number" ? prod.stock : 0,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("updateCart error:", err);
    res.status(500).json({ message: "Server error while updating cart" });
  }
};
