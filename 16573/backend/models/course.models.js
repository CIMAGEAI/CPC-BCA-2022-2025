//database schema

import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // changed
  discount: {
    type: Number,
    default: 0,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  // changed: added to store PDF file link from Cloudinary
  pdfUrl: {
    type: String,
    default: "", // if no pdf is uploaded, default to empty string
  },

  // ✅ added courseLink (optional field)
  courseLink: {
    type: String,
    default: "", // optional YouTube or video link
  },
});

// firstely convert into model then export in db it is store with name of "Course"
export const Course = mongoose.model("Course", courseSchema);
