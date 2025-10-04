import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../utils/db.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing!");
  process.exit(1);
}

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      const msg = err.name === "TokenExpiredError" ? "Session expired" : "Invalid token";
      return res.status(401).json({ message: msg, success: false });
    }

    const { userId, role, status } = decoded;

    if (!userId || !role) {
      return res.status(401).json({ message: "Invalid token payload", success: false });
    }

    req.user = {
      id: userId,    // always use users.user_id
      role,
      status
    };

    // Optional: For jobseekers, you can also attach applicant_id if needed
    if (role === "jobseeker") {
      req.user.applicant_id = userId;
    }

    next();
  } catch (err) {
    console.error("❌ Authentication middleware error:", err);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export default isAuthenticated;
