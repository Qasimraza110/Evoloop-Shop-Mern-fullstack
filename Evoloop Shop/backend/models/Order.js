import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ standard
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    stripeSessionId: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending | paid | failed
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
