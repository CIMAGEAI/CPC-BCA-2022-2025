import { Course } from "../models/course.models.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";
import fs from "fs";
import path from "path";
import Stripe from "stripe";
import config from "../config.js";
import imagekit from "../utils/imagekit.js";

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

// CREATE COURSE
export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price, discount, courseLink } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      return res.status(400).json({ errors: "Price must be a valid number" });
    }

    const image = req.files?.image?.[0];
    const pdf = req.files?.pdf?.[0];

    const allowedImageFormats = ["image/png", "image/jpeg", "image/jpg"];
    const allowedImageExts = [".png", ".jpg", ".jpeg"];

    if (!image || !allowedImageFormats.includes(image.mimetype)) {
      return res.status(400).json({ errors: "Invalid image format. Only PNG, JPG allowed" });
    }
    const ext = path.extname(image.originalname).toLowerCase();
    if (!allowedImageExts.includes(ext)) {
      return res.status(400).json({ errors: "Invalid image file extension." });
    }
    if (image.size > 5 * 1024 * 1024) {
      return res.status(400).json({ errors: "Image size exceeds 5MB limit" });
    }

    // upload to cloudinary
    const cloud_response = await cloudinary.uploader.upload(image.path, {
      folder: "courseImages",
    });
    fs.unlinkSync(image.path);

    let uploadedPdfUrl = "";
    if (pdf) {
      const allowedPdfFormat = ["application/pdf"];
      if (!allowedPdfFormat.includes(pdf.mimetype)) {
        return res.status(400).json({ errors: "Only PDF files allowed." });
      }
      if (pdf.size > 10 * 1024 * 1024) {
        return res.status(400).json({ errors: "PDF size exceeds 10MB limit" });
      }

      const pdfBuffer = fs.readFileSync(pdf.path);
      const base64PDF = pdfBuffer.toString("base64");

      const uploadResult = await imagekit.upload({
        file: base64PDF,
        fileName: path.parse(pdf.originalname).name + "-" + Date.now() + ".pdf",
        folder: "/coursePdfs",
      });
      fs.unlinkSync(pdf.path);

      uploadedPdfUrl = uploadResult.url;
    }

    const courseData = {
      title,
      description,
      price: numericPrice,
      discount: discount ? Number(discount) : 0,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url,
      },
      creatorId: adminId,
      pdfUrl: uploadedPdfUrl,
      courseLink: courseLink || "",
    };

    const course = await Course.create(courseData);
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("Error in createCourse:", error);
    res.status(500).json({
      errors: error.message || "Unknown error occurred while creating the course",
      stack: error.stack,
    });
  }
};

// UPDATE COURSE
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, discount, courseLink } = req.body;

  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Course not found" });
    }

    let imageData = courseSearch.image;
    let pdfUrl = courseSearch.pdfUrl;

    if (req.files && req.files.image) {
      const file = req.files.image[0];
      if (imageData?.public_id) {
        await cloudinary.uploader.destroy(imageData.public_id);
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "courseImages",
      });

      imageData = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      fs.unlinkSync(file.path);
    }

    if (req.files && req.files.pdf) {
      const pdfFile = req.files.pdf[0];
      const allowedPdfFormat = ["application/pdf"];
      if (!allowedPdfFormat.includes(pdfFile.mimetype)) {
        return res.status(400).json({ errors: "Only PDF files are allowed for course material" });
      }

      const pdfBuffer = fs.readFileSync(pdfFile.path);
      const base64PDF = pdfBuffer.toString("base64");

      const uploadResult = await imagekit.upload({
        file: base64PDF,
        fileName: path.parse(pdfFile.originalname).name + "-" + Date.now() + ".pdf",
        folder: "/coursePdfs",
      });

      fs.unlinkSync(pdfFile.path);
      pdfUrl = uploadResult.url;
    }

    if (!title || !description || !price) {
      return res.status(400).json({
        errors: "All fields are required (image/pdf optional)",
      });
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, creatorId: adminId },
      {
        title,
        description,
        price: Number(price),
        discount: discount ? Number(discount) : 0,
        image: imageData,
        pdfUrl,
        courseLink: courseLink || courseSearch.courseLink, // ✅ added course link update
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(403).json({ errors: "You are not authorized to update this course" });
    }

    res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("Error in updateCourse:", error);
    res.status(500).json({ errors: "Error updating the course" });
  }
};

// DELETE COURSE
export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;

  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res.status(404).json({ errors: "Can't delete course created by other admin" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    res.status(500).json({ errors: "Error deleting the course" });
  }
};

// GET ALL COURSES
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error in getCourses:", error);
    res.status(500).json({ errors: "Error fetching courses" });
  }
};

// COURSE DETAILS
export const courseDetails = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.error("Error in courseDetails:", error);
    res.status(500).json({ errors: "Error fetching course details" });
  }
};

// BUY COURSE
export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ errors: "User has already purchased this course" });
    }

    let amount = course.price;
    if (course.discount) {
      const discountAmount = (amount * course.discount) / 100;
      amount = Math.round(amount - discountAmount);
    }

    if (amount <= 0) {
      await Purchase.create({ userId, courseId });
      return res.status(200).json({ message: "Course enrolled for free", course });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(201).json({
      message: "Payment required",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error in buyCourses:", error);
    res.status(500).json({ errors: "Error in course buying" });
  }
};

// DOWNLOAD PDF - Only for purchased users
export const downloadCoursePdf = async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const purchase = await Purchase.findOne({ userId, courseId });
    if (!purchase) {
      return res.status(403).json({ errors: "You have not purchased this course" });
    }

    if (!course.pdfUrl) {
      return res.status(404).json({ errors: "No PDF available for this course" });
    }

    return res.redirect(course.pdfUrl);
  } catch (error) {
    console.error("Error in downloadCoursePdf:", error);
    res.status(500).json({ errors: "Error downloading PDF" });
  }
};
