import jwt from "jsonwebtoken";
import config from "../config.js";

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);

    req.adminId = decoded.id; // yahi tumhara admin token ka decoded ID set karta hai
    next();
  } catch (error) {
    console.log("Invalid or expired admin token");
    return res.status(401).json({ errors: "Invalid or expired token" });
  }
}

export default adminMiddleware;
