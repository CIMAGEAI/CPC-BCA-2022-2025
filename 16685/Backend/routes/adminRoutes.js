const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { getAllUsers, getStats, getAllTickets } = require("../controllers/adminController");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_HASHED_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || "adminsecret";

// 🔐 Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, ADMIN_HASHED_PASSWORD);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({ message: "Login successful", token });
});

// 👤 Get All Users (Protected)
router.get("/users", verifyToken, adminOnly, getAllUsers);

// 📊 Get Stats Summary (Protected)
router.get("/stats", verifyToken, adminOnly, getStats);

// 🎟️ Get All Booked Tickets (Protected) ✅ ✅
router.get("/tickets", verifyToken, adminOnly, getAllTickets);

module.exports = router;
