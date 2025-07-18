import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

import fileUpload from "express-fileupload"; // Optional: if you want to use express-fileupload

import testRoutes from "./routes/test.route.js";




import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";

import userRoutes from "./routes/user.route.js";

import announcementRoute from "./routes/announcement.route.js";
 


const app = express();
dotenv.config();

app.use(express.json());
// app.use(fileUpload({useTempFiles: true})); // Optional: if you want to use express-fileupload
// app.use(
//   fileUpload({
//     useTempFiles: true, // ✅ VERY IMPORTANT
//     tempFileDir: "/tmp/",
//   })
// );


app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// TODO: Add your file upload middleware here if using global upload
// e.g., app.use(fileUpload()); or multer upload handled in routes/controllers

// Connect to MongoDB
const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

(async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Cannot connect to DB", error);
    process.exit(1);
  }
})();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});
console.log("✅ Cloudinary configured");

app.get("/", (req, res) => {
  res.send("🟢 Backend server is running");
  console.log("GET / request received.");
});

// Routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/users",userRoutes);

app.use("/api/v1/test", testRoutes);
app.use("/api/v1/announcement", announcementRoute);





// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`🚀 Server is listening at http://localhost:${port}`);
});




// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import { v2 as cloudinary } from "cloudinary";
// import cors from "cors";

// import fileUpload from "express-fileupload";

// import testRoutes from "./routes/test.route.js";
// import userRoute from "./routes/user.route.js";
// import courseRoute from "./routes/course.route.js";
// import adminRoute from "./routes/admin.route.js";
// import orderRoute from "./routes/order.route.js";
// import announcementRoute from "./routes/announcement.route.js"; // ✅ added
// import userRoutes from "./routes/user.route.js";

// const app = express();
// dotenv.config();

// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // Connect to MongoDB
// const port = process.env.PORT || 3000;
// const DB_URI = process.env.MONGO_URI;

// (async () => {
//   try {
//     await mongoose.connect(DB_URI);
//     console.log("✅ Database connected");
//   } catch (error) {
//     console.error("❌ Cannot connect to DB", error);
//     process.exit(1);
//   }
// })();

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret,
// });
// console.log("✅ Cloudinary configured");

// app.get("/", (req, res) => {
//   res.send("🟢 Backend server is running");
//   console.log("GET / request received.");
// });

// // Routes
// app.use("/api/v1/course", courseRoute);
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/admin", adminRoute);
// app.use("/api/v1/order", orderRoute);
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/announcement", announcementRoute); // ✅ added
// app.use("/api/v1/test", testRoutes);

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: err.message || "Something went wrong!" });
// });

// app.listen(port, () => {
//   console.log(`🚀 Server is listening at http://localhost:${port}`);
// });
