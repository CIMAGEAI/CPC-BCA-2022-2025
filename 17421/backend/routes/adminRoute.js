import express from "express";
import {addDoctor , allDoctors, loginAdmin, appointmntAdmin, appointmentCancelAdmin, adminDashboardData,allUsers,deleteUser,deleteDoctor}  from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image') ,addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmntAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancelAdmin)
adminRouter.get('/dashboard', authAdmin, adminDashboardData)
adminRouter.post('/all-patients', authAdmin, allUsers)
adminRouter.delete('/delete-patient',authAdmin, deleteUser )
adminRouter.delete('/delete-doctor', authAdmin,deleteDoctor )

export default adminRouter