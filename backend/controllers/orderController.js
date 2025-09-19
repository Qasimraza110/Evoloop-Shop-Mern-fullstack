import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Shipping from "../models/Shipping.js";

export const createOrder = async (req, res) => {
  try {
    const { items, total, stripeSessionId } = req.body;

    if (!items || !total || !stripeSessionId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    for (const it of items) {
      if (!mongoose.Types.ObjectId.isValid(it._id)) {
        return res.status(400).json({ message: `Invalid product ID: ${it._id}` });
      }

      const product = await Product.findById(it._id);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${it._id}` });
      }

      if (product.stock < it.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      // reduce stock
      product.stock -= it.quantity;
      await product.save();
    }

    const newOrder = await Order.create({
      user: req.user._id,
      items: items.map(it => ({
        _id: it._id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
      total,
      stripeSessionId,
      status: "pending",
    });

    res.status(201).json(newOrder);
  } catch (error) {
   
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items._id", "name price image stock") // stock bhi populate karo
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items._id", "name price image stock")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

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

export const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).populate(
      "items._id",
      "name price"
    );
    res.json(orders);
  } catch (err) {
    console.error("❌ Get orders by user error:", err);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

export const getUserShipping = async (req, res) => {
  try {
    const shipping = await Shipping.findOne({ user: req.params.id });

    if (!shipping) {
      return res.status(404).json({ message: "Shipping not found" });
    }

    res.json(shipping);
  } catch (error) {
    console.error("Get shipping error:", error);
    res.status(500).json({ message: "Server error" });
  }
};