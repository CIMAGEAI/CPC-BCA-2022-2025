import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    testLink: {
      type: String,
      required: true,
    },
    accessCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Test = mongoose.model("Test", testSchema);
