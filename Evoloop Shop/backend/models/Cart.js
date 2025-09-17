import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{ _id: String, name: String, price: Number, quantity: Number }]
});

export default mongoose.model("Cart", cartSchema);
