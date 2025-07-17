import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.models.js";

// -------------------- SIGNUP --------------------
export const signup = async (req, res) => {
  const { firstName, lastName, mobile, email, password } = req.body;

  const userSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters" })
      .regex(/^[A-Za-z\s]+$/, { message: "First name must contain only letters" }),
    lastName: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters" })
      .regex(/^[A-Za-z\s]+$/, { message: "Last name must contain only letters" }),
    mobile: z
      .string()
      .regex(/^[0-9]{10}$/, { message: "Mobile must be a 10-digit number" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    email: z
      .string()
      .email({ message: "Invalid email address" }),
  });

  const validateData = userSchema.safeParse(req.body);
  if (!validateData.success) {
    return res
      .status(400)
      .json({
        errors: validateData.error.issues.map((err) => err.message),
      });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      mobile,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup succeeded", newUser });
  } catch (error) {
    console.log("Error in signup", error);
    res.status(500).json({ errors: "Error in signup" });
  }
};


// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    // ✅ Update login time
    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, config.JWT_USER_PASSWORD, { expiresIn: "1d" });

    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    };

    res.cookie("jwt", token, cookieOptions);
    res.status(201).json({ message: "Login successful", user, token });
  } catch (error) {
    console.log("Error in login", error);
    res.status(500).json({ errors: "Error in login" });
  }
};

// -------------------- LOGOUT --------------------
export const logout = async (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).json({ errors: "Kindly login first" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log("Error in logout", error);
    res.status(500).json({ errors: "Error in logout" });
  }
};

// -------------------- PURCHASED COURSES --------------------
export const purchases = async (req, res) => {
  const userId = req.userId;

  try {
    const purchased = await Purchase.find({ userId });
    const purchasedCourseId = purchased.map(p => p.courseId);

    const courseData = await Course.find({ _id: { $in: purchasedCourseId } });

    // ✅ Update last purchase time
    await User.findByIdAndUpdate(userId, { lastPurchaseAt: new Date() });

    res.status(200).json({ purchased, courseData });
  } catch (error) {
    console.log("Error in purchases", error);
    res.status(500).json({ errors: "Error in purchases" });
  }
};

// -------------------- PROFILE --------------------
export const profile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ errors: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in fetching profile", error);
    res.status(500).json({ errors: "Error in fetching user profile" });
  }
};

// -------------------- ALL USERS FOR ADMIN --------------------
export const allUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    const userWithCourses = await Promise.all(
      users.map(async (user) => {
        const purchases = await Purchase.find({ userId: user._id });

        const detailedPurchases = await Promise.all(
          purchases.map(async (purchase) => {
            const course = await Course.findById(purchase.courseId).select("title");
            return {
              courseId: purchase.courseId,
              title: course?.title || "Unknown Course",
            };
          })
        );

        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,

          createdAt: user.createdAt || null,
          lastLoginAt: user.lastLoginAt || null,
          lastPurchaseAt: user.lastPurchaseAt || null,

          purchases: detailedPurchases,
        };
      })
    );

    res.status(200).json({
      success: true,
      users: userWithCourses,
    });
  } catch (error) {
    console.error("Error in fetching all users", error);
    res.status(500).json({
      success: false,
      message: "Error in fetching all users",
    });
  }
};
