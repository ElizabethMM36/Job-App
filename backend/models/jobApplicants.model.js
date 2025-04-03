import pool from "../utils/db.js";

// ✅ Insert New Applicant (Including `experience`)
export const insertApplicant = async (user_id, username, password, full_name, birth_year, current_location, phone, email, preferred_position, industry_fields, experience) => {
    const query = `
        INSERT INTO job_applicants (user_id, username, password, full_name, birth_year, current_location, phone, email, preferred_position, industry_fields, experience) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [user_id, username, password, full_name, birth_year, current_location, phone, email, preferred_position, industry_fields, experience]);
    return result.insertId;
};

// ✅ Update Applicant Profile (Including `experience`)
export const updateApplicantProfile = async (user_id, phone, email, experience) => {
    const query = `UPDATE job_applicants SET phone = ?, email = ?, experience = ? WHERE user_id = ?`;
    await pool.query(query, [phone, email, experience, user_id]);
};

// ✅ Get All Applicants
export const getAllApplicantsFromDB = async () => {
    const query = `SELECT * FROM job_applicants`;
    const [rows] = await pool.query(query);
    return rows;
};

// ✅ Get Applicant By ID
export const getApplicantByIdFromDB = async (id) => {
    const query = `SELECT * FROM job_applicants WHERE user_id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
};
