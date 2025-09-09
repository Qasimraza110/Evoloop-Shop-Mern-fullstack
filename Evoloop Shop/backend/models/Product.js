import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  stock: { type: Number, required: true, default: 10 } 
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
