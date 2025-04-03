import db from "../utils/db.js";

// ✅ Get User Profile
export const getProfile = async (req, res) => {
    try {
        const applicant_id = req.user.id; // ✅ Change from req.userId to req.user.id
// Ensure authentication middleware sets this
        const [profile] = await db.execute("SELECT * FROM job_applicants WHERE applicant_id = ?", [applicant_id]);

        if (profile.length === 0) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({ profile: profile[0], success: true });
    } catch (error) {
        console.error("❌ Get Profile Error:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// ✅ Update Profile
export const updateProfile = async (req, res) => {
    try {
        const username = req.user.id; // ✅ Use `req.user.id` as the username reference
        const {
            full_name,
            birth_year,
            current_location,
            phone,
            email,
            preferred_position,
            industry_fields,
            experience
        } = req.body;

        // ✅ Convert industry_fields array to string if needed
        const industryFieldsStr = Array.isArray(industry_fields) ? industry_fields.join(", ") : industry_fields;

        // ❌ Check if required fields are missing
        if (!full_name || !birth_year || !current_location || !phone || !email) {
            return res.status(400).json({ message: "Missing required fields.", success: false });
        }

        console.log("📌 Update Profile Request Data:", req.body);
        console.log("✅ Authenticated Username:", username);

        // 🔍 Check if the user already exists in `job_applicants`
        const [existingApplicant] = await db.execute(
            "SELECT applicant_id FROM job_applicants WHERE username = ?", 
            [username]
        );

        let applicant_id;

        if (existingApplicant.length === 0) {
            // ✅ User does NOT exist, INSERT them and get the new auto-incremented `applicant_id`
            const [insertResult] = await db.execute(
                "INSERT INTO job_applicants (username, full_name, birth_year, current_location, phone, email, preferred_position, industry_fields, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [username, full_name, birth_year, current_location, phone, email, preferred_position, industryFieldsStr, experience]
            );

            applicant_id = insertResult.insertId; // 🔥 Get the newly generated applicant_id
            console.log(`✅ New applicant inserted with ID: ${applicant_id}`);
        } else {
            // ✅ User exists, use the existing `applicant_id`
            applicant_id = existingApplicant[0].applicant_id;
            console.log(`🔄 Updating existing applicant with ID: ${applicant_id}`);
        }

        // 🔍 Check if email is already used by another user
        const [existingUser] = await db.execute(
            "SELECT * FROM job_applicants WHERE email = ? AND applicant_id != ?",
            [email, applicant_id]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already in use.", success: false });
        }

        // ✅ Update user profile in the database
        await db.execute(
            "UPDATE job_applicants SET full_name = ?, birth_year = ?, current_location = ?, phone = ?, email = ?, preferred_position = ?, industry_fields = ?, experience = ? WHERE applicant_id = ?",
            [full_name, birth_year, current_location, phone, email, preferred_position, industryFieldsStr, experience, applicant_id]
        );

        return res.status(200).json({ message: "Profile updated successfully.", success: true });
    } catch (error) {
        console.error("❌ Update Profile Error:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};