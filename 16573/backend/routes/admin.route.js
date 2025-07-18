//defining admin route

import express  from "express";
import { login, logout, signup } from "../controllers/admin.controller.js";
 
 
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout", logout);

// Endpoint to verify the admin dashboard password
router.post("/verify-password", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_DASHBOARD_PASSWORD) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }
});

 

export default router;