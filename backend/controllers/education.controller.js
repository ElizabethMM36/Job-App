import db from "../utils/db.js";

//// ✅ Add Education Details
export const addEducation = async (req, res) => {
    try {
        console.log("📩 Received Data:", req.body);
        const { institution, degree, start_year, end_year, certificate_files } = req.body;
        const username = req.user.id; // ✅ Extract username from authentication middleware

        console.log("📌 Extracted username:", username);

        // ✅ 1. Fetch applicant_id using username
        const [applicant] = await db.execute(
            "SELECT applicant_id FROM job_applicants WHERE username = ?",
            [username]
        );

        console.log("🔍 Applicant Query Result:", applicant); // Debugging line

        if (!applicant || applicant.length === 0 || !applicant[0].applicant_id) {
            console.error("❌ Applicant ID not found for username:", username);
            return res.status(400).json({ success: false, message: "Applicant ID not found for this user" });
        }

        const applicant_id = applicant[0].applicant_id;
        console.log("✅ Extracted applicant_id:", applicant_id);

        // ✅ 2. Validate required fields
        if (!institution || !degree || !start_year) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields: institution, degree, start_year" 
            });
        }

        // ✅ 3. Ensure values are not undefined before inserting
        const values = [
            applicant_id,
            institution,
            degree,
            start_year,
            end_year !== undefined ? end_year : null,
            certificate_files !== undefined ? certificate_files : null
        ];

        // ✅ 4. Insert into applicant_education
        const sql = `
            INSERT INTO applicant_education (applicant_id, institution, degree, start_year, end_year, certificate_files)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        console.log("🚀 SQL Query:", sql);
        console.log("📩 Final Insert Values:", values);

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
        const { applicant_id } = req.query; // Expecting applicant_id from request

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

        const { applicant_id } = req.body; // Expect applicant_id in request body
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
