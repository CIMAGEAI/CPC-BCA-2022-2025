const User = require("../models/User");
const Booking = require("../models/Booking");

// 👥 Get all users (admin-only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    const bookings = await Booking.find();

    const ticketMap = {};
    bookings.forEach((b) => {
      const userId = b.userId?.toString();
      if (userId) {
        ticketMap[userId] = (ticketMap[userId] || 0) + 1;
      }
    });

    const usersWithTicketCount = users.map((user) => ({
      ...user._doc,
      ticketCount: ticketMap[user._id.toString()] || 0
    }));

    res.status(200).json(usersWithTicketCount);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

// 📊 Get admin stats (users, bookings, revenue)
exports.getStats = async (req, res) => {
  try {
    // 1️⃣ Total registered users
    const totalUsers = await User.countDocuments();

    // 2️⃣ Total tickets booked
    const totalBookings = await Booking.countDocuments();

    // 3️⃣ Today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingsToday = await Booking.countDocuments({
      createdAt: { $gte: today }
    });

    // 4️⃣ This week's bookings (start from Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const bookingsThisWeek = await Booking.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    // 5️⃣ Total revenue (assumes amountPaid field in ₹)
    const revenueAgg = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amountPaid" } 
        }
      }
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // ✅ Send all stats
    res.status(200).json({
      totalUsers,
      totalBookings,
      bookingsToday,
      bookingsThisWeek,
      revenue: totalRevenue
    });

  } catch (error) {
    console.error("Error in getStats:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// 🎟️ Get all booked tickets (admin-only)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Booking.find()
      .populate("userId", "name email") 
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ message: "Failed to retrieve tickets" });
  }
};
