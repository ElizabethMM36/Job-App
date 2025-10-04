import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../utils/db.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// REGISTER USER (jobseeker / recruiter / admin)
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role)
      return res.status(400).json({ message: "All fields are required", success: false });

    if (!["jobseeker", "recruiter", "admin"].includes(role))
      return res.status(400).json({ message: "Invalid role", success: false });

    const [existingUser] = await db.execute("SELECT email FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0)
      return res.status(400).json({ message: "Email already registered", success: false });

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePhoto = null;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResp = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResp.secure_url;
    }

    const status = role === "admin" ? "verified" : "pending";

    const [result] = await db.execute(
      `INSERT INTO users (fullname, email, phoneNumber, password, role, profilePhoto, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fullname, email, phoneNumber, hashedPassword, role, profilePhoto, status]
    );

    const userId = result.insertId;

    if (role === "jobseeker") {
      await db.execute(
        `INSERT INTO job_applicants (applicant_id, full_name, email, phone, status)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, fullname, email, phoneNumber, status]
      );
    }

    if (role === "recruiter") {
      await db.execute(
        `INSERT INTO recruiters (user_id, contact_name, email, phone, status)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, fullname, email, phoneNumber, status]
      );
    }

    return res.status(201).json({
      message: "User registered successfully",
      userId,
      role,
      status,
      success: true,
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ message: "All fields are required", success: false });

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0)
      return res.status(400).json({ message: "Invalid email or password", success: false });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch || role !== user.role)
      return res.status(400).json({ message: "Invalid credentials", success: false });

    const token = jwt.sign(
      { userId: user.user_id, role: user.role, status: user.status, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: `Welcome back, ${user.fullname}`,
      success: true,
      token,
      user: { id: user.user_id, fullname: user.fullname, email: user.email, role: user.role, status: user.status, profilePhoto: user.profilePhoto },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const logout = (req, res) => {
  return res.status(200).cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    expires: new Date(0)
  }).json({ message: "Logged out successfully", success: true });
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated", success: false });

    const userId = req.user.id;

    const {
      birth_year = null,
      current_location = null,
      preferred_position = null,
      industry_fields = null,
      experience = null,
    } = req.body;

    const [applicants] = await db.execute(
      "SELECT * FROM job_applicants WHERE applicant_id = ?",
      [userId]
    );

    if (!applicants.length) return res.status(404).json({ message: "Applicant not found", success: false });

    await db.execute(
      `UPDATE job_applicants
       SET birth_year = ?, current_location = ?, preferred_position = ?, industry_fields = ?, experience = ?
       WHERE applicant_id = ?`,
      [birth_year, current_location, preferred_position, industry_fields ? JSON.stringify(industry_fields) : null, experience, userId]
    );

    const [updatedApplicant] = await db.execute("SELECT * FROM job_applicants WHERE applicant_id = ?", [userId]);
    const applicant = updatedApplicant[0];
    if (applicant.industry_fields) applicant.industry_fields = JSON.parse(applicant.industry_fields);

    return res.status(200).json({ message: "Profile updated successfully", applicant, success: true });
  } catch (error) {
    console.error("❌ updateProfile Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};



// 🟢 GET ALL JOB APPLICANTS
export const getAllApplicants = async (req, res) => {
    try {
        const [applicants] = await db.execute(`
            SELECT users.id, users.fullname, users.email, users.phoneNumber, users.role 
            FROM users 
            INNER JOIN applications ON users.id = applications.userId
        `);

        return res.status(200).json({
            message: "Applicants fetched successfully",
            success: true,
            applicants,
        });
    } catch (error) {
        console.error("❌ Fetch Applicants Error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// 🟢 GET SINGLE APPLICANT BY ID
export const getApplicantById = async (req, res) => {
    const { id } = req.params; // Applicant ID from URL

    try {
        // ✅ Fetch applicant profile
        const [profile] = await db.query("SELECT * FROM job_applicants WHERE applicant_id = ?", [id]);

        if (!profile.length) {
            return res.status(404).json({ message: "Applicant not found" });
        }

        // ✅ Fetch education details
        const [education] = await db.query("SELECT * FROM applicant_education WHERE applicant_id = ?", [id]);

        res.json({ profile: profile[0], education }); // Send both profile & education
    } catch (error) {
        console.error("❌ Error fetching applicant data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};