import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../utils/db.js"; // MySQL database connection
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        console.log("📌 Incoming request data:", req.body);
        console.log("📌 Uploaded file:", req.file);

        const { fullname, email, phoneNumber, password, role } = req.body;
        
        // Check for missing fields
        if (!fullname || !email || !phoneNumber || !password || !role) {
            console.log("⚠️ Missing fields detected");
            return res.status(400).json({ message: "Missing fields", success: false });
        }

        // Check if user exists
        const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        console.log("📌 Existing user check:", existingUser);

        if (existingUser.length > 0) {
            console.log("⚠️ User already exists");
            return res.status(400).json({ message: "User already exists", success: false });
        }

        // Hash password
        console.log("🔐 Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload profile photo (if provided)
        let profilePhotoUrl = "";
        if (req.file) {
            try {
                console.log("📸 Processing profile photo...");
                const fileUri = getDataUri(req.file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                profilePhotoUrl = cloudResponse.secure_url;
                console.log("✅ Cloudinary upload success:", profilePhotoUrl);
            } catch (uploadError) {
                console.error("❌ Cloudinary upload failed:", uploadError);
                return res.status(500).json({ message: "Profile photo upload failed", success: false });
            }
        }

        // Insert user into database
        console.log("📌 Inserting new user into database...");
        await db.execute(
            "INSERT INTO users (fullname, email, phoneNumber, password, role, profilePhoto) VALUES (?, ?, ?, ?, ?, ?)", 
            [fullname, email, phoneNumber, hashedPassword, role, profilePhotoUrl]
        );

        console.log("✅ User registered successfully!");
        return res.status(201).json({ message: "User registered successfully", success: true });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Missing fields", success: false });
        }

        // Find user
        const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }

        const user = users[0];

        // Check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch || role !== user.role) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "1d" });

        return res.status(200).cookie("token", token, { httpOnly: true, sameSite: "strict" }).json({
            message: `Welcome back, ${user.fullname}`,
            success: true,
            user: { id: user.id, fullname: user.fullname, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const logout = (req, res) => {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "Logged out successfully", success: true });
};
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id; // Middleware authentication extracts user ID

        let skillsArray = skills ? skills.split(",") : [];

        // Fetch user from the database
        const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [userId]);

        if (users.length === 0) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        let profilePhotoUrl = users[0].profilePhoto; // Keep existing photo unless updated

        // If a file is uploaded, upload it to Cloudinary
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url;
        }

        // Update user data in MySQL
        await db.execute(
            `UPDATE users 
             SET fullname = ?, email = ?, phoneNumber = ?, bio = ?, skills = ?, profilePhoto = ? 
             WHERE id = ?`,
            [fullname, email, phoneNumber, bio, skillsArray.join(","), profilePhotoUrl, userId]
        );

        // Fetch updated user details
        const [updatedUsers] = await db.execute("SELECT * FROM users WHERE id = ?", [userId]);

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUsers[0],
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

