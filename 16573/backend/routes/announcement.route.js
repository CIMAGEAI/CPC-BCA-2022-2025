import express from "express";
import { createAnnouncement, getAnnouncements, deleteAnnouncement } from "../controllers/announcement.controller.js";
import adminMiddleware from "../middlewares/admin.mid.js";

const router = express.Router();

// admin routes
router.post("/create", adminMiddleware, createAnnouncement);
router.delete("/delete/:id", adminMiddleware, deleteAnnouncement);

// public routes
router.get("/all", getAnnouncements);

export default router;
