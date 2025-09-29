import pool from '../utils/db.js';

// ✅ Create Education Table (if not exists)
export const createApplicantEducationTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS applicant_education (
            education_id INT AUTO_INCREMENT PRIMARY KEY,
            applicant_id INT NOT NULL,
            institution VARCHAR(255) NOT NULL,
            degree VARCHAR(255) NOT NULL,
            start_year INT NOT NULL,
            end_year INT,
            cgpa DECIMAL(3,2) NOT NULL,  -- ✅ Added CGPA (with 2 decimal places)
            college_location VARCHAR(255) NOT NULL,  -- ✅ Added College Location
            certificate_files TEXT,  -- Stores uploaded file paths (comma-separated)
            FOREIGN KEY (applicant_id) REFERENCES job_applicants(applicant_id) ON DELETE CASCADE
        );
    `;
    await pool.query(query);
};

// ✅ Insert Education Record (Returns Insert ID)
export const insertEducation = async (applicant_id, institution, degree, startYear, endYear, cgpa, collegeLocation, certificateFiles) => {
    try {
        if (!applicant_id || !institution || !degree || !startYear || !cgpa || !collegeLocation) {
            throw new Error("Missing required fields in insertEducation function.");
        }

        console.log("📩 Final Values Before Insert:", { 
            applicant_id, 
            institution, 
            degree, 
            startYear, 
            endYear, 
            cgpa,
            collegeLocation,
            certificateFiles 
        });

        const query = `
            INSERT INTO applicant_education 
            (applicant_id, institution, degree, start_year, end_year, cgpa, college_location, certificate_files) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            applicant_id, 
            institution, 
            degree, 
            startYear, 
            endYear !== undefined ? endYear : null, 
            cgpa,
            collegeLocation,
            certificateFiles !== undefined ? certificateFiles : null
        ];

        const [result] = await pool.query(query, values);
        return result.insertId;
    } catch (error) {
        console.error("❌ Error in insertEducation:", error);
        throw error;
    }
};

// ✅ Fetch Education Details by Applicant ID
export const getEducationByApplicantId = async (applicant_id) => {
    const query = `SELECT * FROM applicant_education WHERE applicant_id = ?`;
    const [rows] = await pool.query(query, [applicant_id]);
    return rows;
};
