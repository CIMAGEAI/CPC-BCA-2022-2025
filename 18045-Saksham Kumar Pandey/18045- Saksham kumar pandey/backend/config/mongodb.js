// backend/config/mongodb.js

import mongoose from "mongoose";

// Sample schemas (replace with actual schema files)
const appointmentSchema = new mongoose.Schema({
  patientName: String,
  date: Date,
});

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
});

// Mongoose models
const Appointment = mongoose.model("Appointment", appointmentSchema);
const Doctor = mongoose.model("Doctor", doctorSchema);
const User = mongoose.model("User", userSchema);

// Database connection function
const connectDB = async () => {
  try {
    // Use the URI from .env as-is (no /CareMate added here)
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () =>
      console.log("✅ Database Connected to CareMate (localhost)")
    );

    // Insert sample data only if collections are empty
    const appointmentCount = await Appointment.countDocuments();
    const doctorCount = await Doctor.countDocuments();
    const userCount = await User.countDocuments();

    if (appointmentCount === 0)
      await Appointment.create({ patientName: "John Doe", date: new Date() });

    if (doctorCount === 0)
      await Doctor.create({ name: "Dr. Smith", specialization: "Cardiology" });

    if (userCount === 0)
      await User.create({ username: "saksham", email: "saksham@email.com" });

    console.log("✅ Sample data inserted into CareMate database");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;