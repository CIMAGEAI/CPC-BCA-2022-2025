import express from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  courseDetails,
  buyCourses,
  downloadCoursePdf,
} from "../controllers/course.controller.js";

import adminMiddleware from "../middlewares/admin.mid.js";
import userMiddleware from "../middlewares/user.mid.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Admin Routes
router.post(
  "/create",
  adminMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createCourse
);

router.put(
  "/update/:courseId",
  adminMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateCourse
);

router.delete("/delete/:courseId", adminMiddleware, deleteCourse);

// Public Routes
router.get("/courses", getCourses);
router.get("/:courseId", courseDetails);

// User Routes
router.post("/buy/:courseId", userMiddleware, buyCourses);
router.get("/download/:courseId", userMiddleware, downloadCoursePdf);

export default router;
