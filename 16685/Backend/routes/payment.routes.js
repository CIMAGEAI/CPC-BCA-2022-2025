const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ========== Create Razorpay Order ==========
router.post("/checkout", async (req, res) => {
  try {
    const { from, to, adults, children, ticketType, amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount." });
    }

    const options = {
      amount: amount, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { from, to, ticketType, adults, children },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("🔥 Razorpay Order Error:", error);
    res.status(500).json({ message: "Razorpay order failed." });
  }
});

// ========== Verify Razorpay Signature & Save Booking ==========
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = req.body;

  try {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid Razorpay signature." });
    }

    const newBooking = new Booking({
      from: bookingData.from,
      to: bookingData.to,
      adults: bookingData.adults,
      children: bookingData.children,
      ticketType: bookingData.ticketType,
      totalFare: bookingData.amount / 100, 
      userEmail: bookingData.userEmail,
    });

    await newBooking.save();
    res.status(200).json({ message: "Booking successful!" });

  } catch (err) {
    console.error("🔥 Booking Save Error:", err);
    res.status(500).json({ message: "Booking verification or saving failed." });
  }
});

module.exports = router;
