import pool from "../utils/db.js";

export const applyJob = async (userId, jobId) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO applications (userId, jobId) VALUES (?, ?)`;
        pool.query(sql, [userId, jobId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

export const getApplicationsByUser = async (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM applications WHERE userId = ?`;
        pool.query(sql, [userId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};
