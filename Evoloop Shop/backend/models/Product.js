import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    isFeatured: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    category: {
      type: String,
      enum: [
        "clothes",
        "electronics",
        "accessories",
        "shoes",
        "home",
        "mobiles",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
