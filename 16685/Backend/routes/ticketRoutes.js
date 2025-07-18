const express = require("express");
const router = express.Router();

const {
  bookTicket,
  getAllBookings,
  getBookingsByUser,  
} = require("../controllers/ticketController");

// ✅ POST - Book a ticket
router.post("/book", bookTicket);

// ✅ GET - Admin: Get all bookings
router.get("/all", getAllBookings);

// ✅ NEW: Get tickets by user ID (for profile "My Tickets")
router.get("/user/:userId", getBookingsByUser);

module.exports = router;
