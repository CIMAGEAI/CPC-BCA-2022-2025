const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  adults: { type: Number, required: true },
  children: { type: Number },
  ticketType: { type: String, required: true },
  fare: { type: Number, required: true },           
  amountPaid: { type: Number, required: true },     
  userEmail: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
