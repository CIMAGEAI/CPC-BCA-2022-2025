import express from "express";
import { createTest, getTests, deleteTest } from "../controllers/test.controller.js";
import adminMiddleware from "../middlewares/admin.mid.js";

const router = express.Router();

// Admin Routes
router.post("/create", adminMiddleware, createTest);
router.delete("/delete/:testId", adminMiddleware, deleteTest);

// Public route for both admin and user to get tests
router.get("/all", getTests);

export default router;
