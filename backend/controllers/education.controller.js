import db from "../utils/db.js";

// ✅ Add Education Details
export const addEducation = async (req, res) => {
    try {
        console.log("📩 Received Data:", req.body);

        const { institution, degree, start_year, end_year, cgpa, college_location } = req.body;
        const applicant_id = req.user.applicant_id; // ✅ Directly use `req.user.applicant_id`

        console.log("✅ Using applicant_id from req.user:", applicant_id);

        if (!applicant_id) {
            return res.status(400).json({ success: false, message: "Applicant ID is required" });
        }

        // ✅ Insert into `applicant_education`
        const sql = `
            INSERT INTO applicant_education 
            (applicant_id, institution, degree, start_year, end_year, cgpa, college_location) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const values = [applicant_id, institution, degree, start_year, end_year || null, cgpa, college_location];

        await db.execute(sql, values);

        res.status(201).json({ success: true, message: "Education details added successfully" });

    } catch (error) {
        console.error("❌ Add Education Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Get Education Details
export const getEducation = async (req, res) => {
    try {
        const applicant_id = req.user.applicant_id; // ✅ Directly use `req.user.applicant_id`

        if (!applicant_id) {
            return res.status(400).json({ success: false, message: "Applicant ID is required" });
        }

        const [education] = await db.execute(
            "SELECT * FROM applicant_education WHERE applicant_id = ?",
            [applicant_id]
        );

        if (education.length === 0) {
            return res.status(404).json({ success: false, message: "No education details found." });
        }

        return res.status(200).json({ success: true, education });

    } catch (error) {
        console.error("❌ Get Education Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Upload Certificate Function
export const uploadCertificate = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const applicant_id = req.user.applicant_id; // ✅ Directly use `req.user.applicant_id`
        const certificateFilePath = req.file.path; // Uploaded file path

        if (!applicant_id) {
            return res.status(400).json({ success: false, message: "Applicant ID is required" });
        }

        await db.execute(
            "UPDATE applicant_education SET certificate_files = ? WHERE applicant_id = ?",
            [certificateFilePath, applicant_id]
        );

        return res.status(200).json({ success: true, message: "Certificate uploaded successfully", filePath: certificateFilePath });

    } catch (error) {
        console.error("❌ Upload Certificate Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
