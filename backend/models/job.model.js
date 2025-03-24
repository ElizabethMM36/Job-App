import pool from "../utils/db.js";

export const createJob = async (job) => {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId, created_by } = job;
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO jobs (title, description, requirements, salary, location, jobType, experience, position, companyId, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        pool.query(sql, [title, description, requirements, salary, location, jobType, experience, position, companyId, created_by], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

export const getJobs = async () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM jobs`;
        pool.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};
