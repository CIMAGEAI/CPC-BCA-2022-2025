 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config.js";
import { Admin } from "../models/admin.model.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const adminSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters long" })
      .regex(/^[A-Za-z]+$/, { message: "First name must only contain letters" }),
    lastName: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters long" })
      .regex(/^[A-Za-z]+$/, { message: "Last name must only contain letters" }),
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  });

  const validateData = adminSchema.safeParse(req.body);
  if (!validateData.success) {
    return res
      .status(400)
      .json({ errors: validateData.error.issues.map((err) => err.message) });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ errors: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Signup succeeded", newAdmin });
  } catch (error) {
    console.log("Error in signup", error);
    res.status(500).json({ errors: "Error in signup" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // pehle admin ko dhundo
    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res
        .status(403)
        .json({ errors: "Invalid email or password (admin not found)" });
    }

    // agar admin mila to uska password verify karo
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res
        .status(403)
        .json({ errors: "Invalid email or password (wrong password)" });
    }

    // jwt generate karo
    const token = jwt.sign(
      {
        id: admin._id,
      },
      config.JWT_ADMIN_PASSWORD,
      { expiresIn: "1d" }
    );

    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.cookie("jwt", token, cookieOptions);

    return res.status(201).json({ message: "Login successful", admin, token });
  } catch (error) {
    console.log("Admin, Error in login", error);
    res.status(500).json({ errors: "Server error in admin login" });
  }
};


export const logout = async (req, res) => {
    try {
        if(!req.cookies.jwt){
            return res.status(401).json({errors: "Kindly login first"})
        }
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        res.status(500).json({ errors: "Error in logut" })
        console.log("Error in logout", error)
    }
};