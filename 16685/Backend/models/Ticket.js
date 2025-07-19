const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  fromStation: {
    type: String,
    required: true,
  },
  toStation: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  ticketType: {
    type: String,
    enum: ['Single', 'Return'],
    default: 'Single',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  qrData: {
    type: String,
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
