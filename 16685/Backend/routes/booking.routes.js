const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// ✅ POST: Create a new booking
router.post("/", async (req, res) => {
  try {
    const {
      from,
      to,
      adults,
      children,
      ticketType,
      totalFare,
      userEmail,
      userId,
    } = req.body;

    const newBooking = new Booking({
      from,
      to,
      adults,
      children,
      ticketType,
      fare: totalFare,
      amountPaid: totalFare, 
      userEmail,
      userId,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET: All bookings (for admin panel)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ NEW: GET bookings for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user tickets:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
