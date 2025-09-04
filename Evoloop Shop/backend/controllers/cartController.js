import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    res.json(cart ? cart.items : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items },
      { upsert: true, new: true }
    );
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
