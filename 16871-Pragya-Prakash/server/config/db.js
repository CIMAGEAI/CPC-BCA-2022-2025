const mongoose = require('mongoose');

module.exports = function connectDB() {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parampara-foods')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}; 