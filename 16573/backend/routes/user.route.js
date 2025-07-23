//defining userroutes

import express from "express"
import { signup, login, logout, purchases,allUsers } from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.mid.js";
 
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout", logout);
router.get("/purchases",userMiddleware,purchases);

router.get("/all-users", (req, res, next) => {
  console.log("GET /api/v1/user/all-users route hit");
  next();
}, allUsers);

// Get user profile

export default router;