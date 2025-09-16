import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    stripeSessionId: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending | shipped | delivered
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
