import pool from "../utils/db.js";
import db from "../utils/db.js"; 
export const createJob = async (job) => {
    let { title, description, requirements, salary, location, jobType, experience, position, companyId, created_by } = job;

    // 🚨 Validate required fields before inserting into the DB
    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId || !created_by) {
        throw new Error("All fields are required.");
    }

    // 🛠️ Convert `salary` to an integer (remove non-numeric characters like 'lpa')
    salary = parseInt(salary.replace(/\D/g, ""), 10); // Converts "7lpa" -> 7

    // Ensure position is a string
    position = String(position);

    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO jobs (title, description, requirements, salary, location, jobType, experience, position, companyId, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)INSERT INTO users (
                id,
                fullname,
                email,
                phoneNumber,
                password,
                role,
                profilePhoto,
                createdAt
              )
            VALUES (
                id:int,
                'fullname:varchar',
                'email:varchar',
                'phoneNumber:varchar',
                'password:varchar',
                'role:enum',
                'profilePhoto:varchar',
                'createdAt:timestamp'
              );
        `;
        pool.query(sql, [title, description, requirements, salary, location, jobType, experience, position, companyId, created_by], (err, results) => {
            if (err) {
                console.error("Error inserting job:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

 // Ensure this is your MySQL2 Promise pool connection

export const getJobs = async () => {
    try {
        const [results] = await db.query(`SELECT * FROM jobs`);  // ✅ Correct syntax for mysql2 Promises
        console.log("🟢 Jobs retrieved:", results);
        return results;
    } catch (error) {
        console.error("❌ Error fetching jobs from database:", error);
        throw error;
    }
};
