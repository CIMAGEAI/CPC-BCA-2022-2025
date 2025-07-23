import mongoose from "mongoose";

// User Schema definition
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // 10-digit number validation (India)
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    // ✅ New tracking fields
    createdAt: {
      type: Date,
      default: Date.now, // User signup time
    },
    lastLoginAt: {
      type: Date,
      default: null,     // Updated at login
    },
    lastPurchaseAt: {
      type: Date,
      default: null,     // Updated on course purchase
    },
  },
  {
    versionKey: false, // to remove "__v" from documents
  }
);

// Model Export
export const User = mongoose.model("User", userSchema);
