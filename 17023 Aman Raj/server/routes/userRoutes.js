import {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorPay,
  verifyRazorPay,
  saveimage,
  getSavedImages,
  forgetPassword,
  getAllUsers,
  getAllTransaction,
  updateUser,
} from "../controllers/usercontroller.js";
import express from "express";
import userAuth from "../middlewares/auth.js";

import upload from "../middlewares/upload.js";
const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forget-password", forgetPassword);
userRouter.get("/credits", userAuth, userCredits);
userRouter.get("/saved-images", userAuth, getSavedImages);
userRouter.post("/save-image", userAuth, upload.single("image"), saveimage);
userRouter.post("/pay-razor", userAuth, paymentRazorPay);
userRouter.post("/verify-razor", verifyRazorPay);
userRouter.post("/update-user", updateUser);
userRouter.get("/all-users", getAllUsers);
userRouter.get("/all-transactions", getAllTransaction);
export default userRouter;
