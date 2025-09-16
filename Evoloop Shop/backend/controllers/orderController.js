import Order from "../models/Order.js";
import Product from "../models/Product.js";

//  Create Order + Update Stock
export const createOrder = async (req, res) => {
  try {
    const { items, total, shipping, stripeSessionId } = req.body;

    if (!items || !total || !shipping || !stripeSessionId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Loop through each item to validate stock and decrement
    for (const it of items) {
      if (!mongoose.Types.ObjectId.isValid(it._id)) {
        return res.status(400).json({ message: `Invalid product ID: ${it._id}` });
      }

      const product = await Product.findById(it._id);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${it._id}` });
      }

      if (product.stock < it.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}. Available: ${product.stock}` });
      }

      console.log(`Before: ${product.name} stock = ${product.stock}`);
      product.stock -= it.quantity;
      await product.save();
      console.log(`After: ${product.name} stock = ${product.stock}`);
    }

    // Save order with product IDs
    const newOrder = await Order.create({
      user: req.user._id,
      items: items.map(it => ({
        _id: it._id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
      total,
      shipping,
      stripeSessionId,
      status: "pending",
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// User orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items._id", "name price image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Admin: all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items._id", "name price image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// Admin: update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

