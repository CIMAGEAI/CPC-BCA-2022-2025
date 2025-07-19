const mongoose = require("mongoose");
const Booking = require("../models/Booking");

// ✅ Book a ticket
exports.bookTicket = async (req, res) => {
  try {
    const { from, to, adults, children, ticketType, amount, userId, userEmail } = req.body;

    console.log("📥 Booking Request Body:", req.body);

    // ✅ Basic validation
    if (!from || !to || !ticketType || !userId || isNaN(amount)) {
      return res.status(400).json({ message: "Missing required ticket details." });
    }

    // ✅ Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ Invalid user ID format:", userId);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // ✅ Convert to ObjectId safely
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      console.error("❌ Failed to convert userId to ObjectId:", err);
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // ✅ Create new booking
    const newBooking = new Booking({
      userId: userObjectId,
      from,
      to,
      adults,
      children,
      ticketType,
      fare: amount,        // optional field
      amountPaid: amount,  // ✅ required field in your schema
      userEmail,
      bookedAt: new Date()
    });

    // ✅ Save to MongoDB
    await newBooking.save();

    res.status(201).json({
      message: "Ticket booked successfully",
      ticket: newBooking
    });
  } catch (err) {
    console.error("❌ Ticket Booking Error:", err);
    res.status(500).json({ error: "Failed to book ticket" });
  }
};

// ✅ Get all bookings (admin view)
exports.getAllBookings = async (req, res) => {
  try {
    const tickets = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (err) {
    console.error("❌ Get Bookings Error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// ✅ Get bookings by user ID (My Tickets)
exports.getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const tickets = await Booking.find({ userId: objectId }).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (err) {
    console.error("❌ Get User Tickets Error:", err);
    res.status(500).json({ error: "Failed to fetch user tickets" });
  }
};
