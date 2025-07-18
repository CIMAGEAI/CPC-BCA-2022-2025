const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// 🔹 Get all users (optional - for admin/debug)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Register a new user
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Let Mongoose schema handle password hashing
    const newUser = new User({ name, email, phone, password });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (err) {
    console.error("Registration failed:", err);

    if (err.code === 11000 && err.keyValue?.email) {
      return res.status(400).json({ message: "Email already registered" });
    }

    res.status(400).json({ message: "Registration failed" });
  }
});

// 🔹 User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login attempt:", email, password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ User found, password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});


// 🔹 Update profile
router.put("/update-profile", async (req, res) => {
  const { name, email, userId } = req.body;

  if (!name || !email || !userId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Profile updated successfully",
      userId: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error during profile update" });
  }
});

module.exports = router;
