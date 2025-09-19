import Shipping from "../models/Shipping.js";

// ✅ Create Shipping
export const createShipping = async (req, res) => {
  try {
    const {
      orderId,   // optional
      fullName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !address || !city || !postalCode || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure user is authenticated via protect middleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const shipping = await Shipping.create({
      user: req.user._id,        // ✅ correct
      orderId: orderId || null,  // optional
      fullName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
    });

    res.status(201).json(shipping);
  } catch (error) {
    console.error("Create shipping error:", error);
    res.status(500).json({ message: "Failed to save shipping" });
  }
};


// ✅ Get Shipping by Order ID
export const getShippingByOrder = async (req, res) => {
  try {
    const shipping = await Shipping.findOne({ orderId: req.params.orderId });
    if (!shipping) return res.status(404).json({ message: "No shipping found" });
    res.json(shipping);
  } catch (error) {
    console.error("Get shipping error:", error);
    res.status(500).json({ message: "Failed to fetch shipping" });
  }
};

// ✅ Get All Shippings (Admin)
export const getAllShippings = async (req, res) => {
  try {
    const shippings = await Shipping.find()
      .populate("orderId")
      .sort({ createdAt: -1 });
    res.json(shippings);
  } catch (error) {
    console.error("Get all shippings error:", error);
    res.status(500).json({ message: "Failed to fetch all shippings" });
  }
};

export const getCurrentUserShipping = async (req, res) => {
  try {
    console.log("Current user:", req.user); // Debug
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const shipping = await Shipping.findOne({ user: req.user._id });
    if (!shipping) return res.status(404).json({ message: "Shipping not found" });

    res.json(shipping);
  } catch (err) {
    console.error("Get current user shipping error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateShipping = async (req, res) => {
  try {
    const shipping = await Shipping.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!shipping) return res.status(404).json({ message: "Shipping not found" });
    res.json(shipping);
  } catch (error) {
    console.error("Update shipping error:", error);
    res.status(500).json({ message: "Failed to update shipping" });
  }
};