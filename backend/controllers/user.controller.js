import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../utils/db.js"; // MySQL database connection
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// 🟢 REGISTER USER
// 🟢 REGISTER USER (Jobseeker + Recruiter)
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    if (!["jobseeker", "recruiter"].includes(role)) {
      return res.status(400).json({ message: "Invalid role", success: false });
    }

    // Check if email exists
    const [existingUser] = await db.execute("SELECT email FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePhotoUrl = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }



    // Insert into users table
    const [result] = await db.execute(
      `INSERT INTO users 
        (fullname, email, phoneNumber, password, role, profilePhoto, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fullname, email, phoneNumber, hashedPassword, role, profilePhotoUrl, status]
    );

    const userId = result.insertId;

    // ✅ If jobseeker, insert into job_applicants with default/optional fields
    if (role === "jobseeker") {
      await db.execute(
        `INSERT INTO job_applicants (
            applicant_id,
            password,
            full_name,
            birth_year,
            current_location,
            phone,
            email,
            preferred_position,
            industry_fields,
            experience
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          hashedPassword,
          fullname,
          null,        // birth_year optional
          null,        // current_location optional
          phoneNumber,
          email,
          null,        // preferred_position optional
          null,        // industry_fields optional
          null         // experience optional
        ]
      );
    }

    return res.status(201).json({ message: "User registered successfully", userId, role, status, success: true });
    
  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// 🟢 LOGIN USER
export const login = async (req, res) => {
    try {
        console.log("📌 Incoming request:", req.body);  

        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }

        const user = users[0];

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch || role !== user.role) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        if (user.role === "recruiter" && user.status !== "approved") {
            return res.status(403).json({ message: "Recruiter account is not approved yet", success: false });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server configuration error", success: false });
        }

        // ✅ Include role in JWT token
     const token = jwt.sign(
  {
    userId: user.user_id,   // <--- important
    role: user.role,
    status: user.status,
    email: user.email
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);


        console.log("Generated Token:", jwt.decode(token)); // ✅ Debugging

        // ✅ Fix: Set secure cookie settings
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only set to true in production (HTTPS)
            sameSite: "None",  // Required for cross-origin authentication
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({
            message: `Welcome back, ${user.fullname}`,
            success: true,
            token, // 🔥 Include the token in response
            user: { id: user.id, fullname: user.fullname, email: user.email, role: user.role }
        });
        

    } catch (error) {
        console.error("❌ Login error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
 
export const logout = (req, res) => {
    return res.status(200).cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        expires: new Date(0) // Expire immediately
    }).json({ message: "Logged out successfully", success: true });
};

// 🟢 UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    console.log("📌 Update Request Body:", req.body);
    console.log("📌 Authenticated User:", req.user);

    // ✅ Ensure middleware attached user
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated", success: false });
    }

    const applicant_id = req.user.applicant_id;
    if (!applicant_id) {
      return res.status(400).json({ message: "Applicant ID not found", success: false });
    }

    // ✅ Extract updatable fields only
    const {
      birth_year = null,
      current_location = null,
      preferred_position = null,
      industry_fields = null,
      experience = null,
    } = req.body;

    // ✅ Check if applicant exists
    let applicants;
    try {
      [applicants] = await db.execute(
        "SELECT * FROM job_applicants WHERE applicant_id = ?",
        [applicant_id]
      );
    } catch (dbErr) {
      console.error("❌ DB SELECT Error:", dbErr);
      return res.status(500).json({ message: "Database error", success: false });
    }

    if (!applicants.length) {
      return res.status(404).json({ message: "Applicant not found", success: false });
    }

    // ✅ Update only allowed fields
    const sqlQuery = `
      UPDATE job_applicants
      SET birth_year = ?, current_location = ?, preferred_position = ?, 
          industry_fields = ?, experience = ?
      WHERE applicant_id = ?
    `;
    const sqlValues = [
  birth_year,
  current_location,
  preferred_position,
  industry_fields ? JSON.stringify(industry_fields) : null,
  experience,
  applicant_id,
];


    try {
      await db.execute(sqlQuery, sqlValues);
      console.log("✅ Profile updated successfully!");
    } catch (updateErr) {
      console.error("❌ DB UPDATE Error:", updateErr);
      return res.status(500).json({ message: "Database update failed", success: false });
    }

    // ✅ Fetch updated profile
    let updatedApplicant;
    try {
      [updatedApplicant] = await db.execute(
        "SELECT * FROM job_applicants WHERE applicant_id = ?",
        [applicant_id]
      );
    } catch (fetchErr) {
      console.error("❌ DB FETCH Error:", fetchErr);
      return res.status(500).json({ message: "Failed to fetch updated applicant", success: false });
    }
 const applicant = updatedApplicant[0];
if (applicant.industry_fields) {
  applicant.industry_fields = JSON.parse(applicant.industry_fields);
}

    return res.status(200).json({
  message: "Profile updated successfully.",
  applicant,
  success: true,
});


  } catch (error) {
    console.error("❌ Unexpected Error in updateProfile:", error);
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