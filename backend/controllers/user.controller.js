import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../utils/db.js"; // MySQL database connection
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// 🟢 REGISTER USER
export const register = async (req, res) => {
    try {
        console.log("📌 Incoming request data:", req.body);
        console.log("📌 Uploaded file:", req.file);

        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        if (!["jobseeker", "recruiter"].includes(role)) {
            return res.status(400).json({ message: "Invalid role", success: false });
        }

        const [existingUser] = await db.execute("SELECT email FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already registered", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePhotoUrl = "";
        if (req.file) {
            try {
                console.log("📸 Uploading profile photo...");
                const fileUri = getDataUri(req.file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                profilePhotoUrl = cloudResponse.secure_url;
            } catch (uploadError) {
                console.error("❌ Cloudinary upload failed:", uploadError);
                return res.status(500).json({ message: "Profile photo upload failed", success: false });
            }
        }

        await db.execute(
            "INSERT INTO users (fullname, email, phoneNumber, password, role, profilePhoto) VALUES (?, ?, ?, ?, ?, ?)", 
            [fullname, email, phoneNumber, hashedPassword, role, profilePhotoUrl]
        );

        console.log("✅ User registered successfully!");
        return res.status(201).json({ message: "User registered successfully", success: true });

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

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server configuration error", success: false });
        }

        // ✅ Include role in JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
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
        console.log("📌 Update Request:", req.body);

        const {
            full_name,
            birth_year,
            current_location,
            phone,
            email,
            preferred_position,
            industry_fields
        } = req.body;

        const applicant_id = req.userId; // Ensure this comes from authentication middleware

        console.log(`🔍 Checking if applicant exists with ID: ${applicant_id}`);
        const [applicants] = await db.execute("SELECT * FROM job_applicants WHERE applicant_id = ?", [applicant_id]);

        if (applicants.length === 0) {
            return res.status(400).json({ message: "Applicant not found.", success: false });
        }

        let profilePhotoUrl = applicants[0].profilePhoto || ""; // Handle profile photo existence

        if (req.file) {
            try {
                console.log("📸 Uploading new profile photo...");
                const fileUri = getDataUri(req.file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                profilePhotoUrl = cloudResponse.secure_url;
            } catch (uploadError) {
                console.error("❌ Cloudinary upload failed:", uploadError);
                return res.status(500).json({ message: "Profile photo upload failed", success: false });
            }
        }

        // ✅ Log the SQL query for debugging
        const sqlQuery = `UPDATE job_applicants 
                          SET full_name = ?, birth_year = ?, current_location = ?, phone = ?, email = ?, 
                              preferred_position = ?, industry_fields = ?, profilePhoto = ? 
                          WHERE applicant_id = ?`;

        const sqlValues = [full_name, birth_year, current_location, phone, email, preferred_position, industry_fields, profilePhotoUrl, applicant_id];

        console.log("📝 SQL Query:", sqlQuery);
        console.log("📌 SQL Values:", sqlValues);

        // ✅ Execute SQL Query
        await db.execute(sqlQuery, sqlValues);

        console.log("✅ Profile updated successfully!");

        // ✅ Fetch updated details
        const [updatedApplicant] = await db.execute("SELECT * FROM job_applicants WHERE applicant_id = ?", [applicant_id]);

        return res.status(200).json({
            message: "Profile updated successfully.",
            applicant: updatedApplicant[0],
            success: true
        });

    } catch (error) {
        console.error("❌ Update Profile Error:", error);
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
    try {
        const { id } = req.params;

        const [applicant] = await db.execute(
            `SELECT users.id, users.fullname, users.email, users.phoneNumber, users.role, users.profilePhoto, users.bio, users.skills 
             FROM users 
             INNER JOIN applications ON users.id = applications.userId
             WHERE users.id = ?`, 
            [id]
        );

        if (applicant.length === 0) {
            return res.status(404).json({ message: "Applicant not found", success: false });
        }

        return res.status(200).json({
            message: "Applicant fetched successfully",
            success: true,
            applicant: applicant[0]
        });

    } catch (error) {
        console.error("❌ Fetch Applicant by ID Error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
