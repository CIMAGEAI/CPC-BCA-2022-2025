import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  email: String,
  userId: String,
  courseId: String,
  paymentId: String,
  amount: Number,
  status: String,
  //changed
  discountPrice: {
    type: Number,
    default: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", orderSchema);