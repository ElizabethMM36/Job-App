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
    // ✅ Get token from cookies or Authorization header
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

    const { userId, role } = decoded;

    if (!userId || !role) {
      return res.status(401).json({ message: "Invalid token payload", success: false });
    }

    if (role === "recruiter") {
      // Recruiters don't have applicant_id
      req.user = { id: userId, role };
      return next();
    }

    // ✅ Jobseeker: fetch applicant_id
    // NEW
const [rows] = await db.execute(
  "SELECT applicant_id FROM job_applicants WHERE applicant_id = ?",
  [userId]
);


   
  if (!rows.length) {
    return res.status(404).json({ message: "Jobseeker profile not found", success: false });
  }

  req.user = {
    id: userId,                    // users table PK
    applicant_id: rows[0].applicant_id, // job_applicants PK
    role,
  };


    next();
  } catch (err) {
    console.error("❌ Authentication middleware error:", err);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export default isAuthenticated;
