import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",     // ✅ Referencing users collection
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",   // ✅ Referencing doctors collection
        required: true,
    },
    slotDate: {
        type: String,
        required: true,
    },
    slotTime: {
        type: String,
        required: true,
    },
    userData: {
        type: Object,
        required: true,
    },
    docData: {
        type: Object,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
    cancelled: {
        type: Boolean,
        default: false,
    },
    payment: {
        type: Boolean,
        default: false,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    }
});

const appointmentModel =
    mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);

export default appointmentModel;