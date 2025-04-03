import pool from "../utils/db.js";

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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

export const getJobs = async () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM jobs`;
        pool.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching jobs:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};
