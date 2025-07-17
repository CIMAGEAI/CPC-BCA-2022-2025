import { Announcement } from "../models/announcement.model.js";

// CREATE Announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, link } = req.body;

    if (!title || !description) {
      return res.status(400).json({ errors: "Title and description are required" });
    }

    const announcement = await Announcement.create({
      title,
      description,
      link: link || "",
    });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Error creating announcement", error);
    res.status(500).json({ errors: "Server error while creating announcement" });
  }
};

// GET all Announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements", error);
    res.status(500).json({ errors: "Server error while fetching announcements" });
  }
};

// DELETE Announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ errors: "Announcement not found" });
    }
    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement", error);
    res.status(500).json({ errors: "Server error while deleting announcement" });
  }
};
