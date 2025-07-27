const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ========== Middlewares ==========
app.use(cors());
app.use(express.json());

// ✅ Log all incoming requests (for debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ========== Serve Static Files ==========
const publicPath = path.resolve(__dirname, "../public");

// Serve main public folder (index.html, style.css, script.js, etc.)
app.use(express.static(publicPath));

// Serve admin panel files (admin-login.html, dashboard.html, etc.)
app.use("/admin", express.static(path.join(publicPath, "admin")));

// ========== Routes ==========
const userRoutes = require("./routes/user.routes");
const bookingRoutes = require("./routes/booking.routes");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");         
const fareRoutes = require("./routes/fareRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/payment.routes");

app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);                        
app.use("/api/fare", fareRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);                        

// ========== Health Check ==========
app.get("/api", (req, res) => {
  res.send("🚇 Patna Metro Backend API Running");
});

// ✅ Serve homepage on root path
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// ❌ 404 Catch-all fallback
app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

// ========== Start Server ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
