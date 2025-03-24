import pool from "../utils/db.js";

export const createCompany = async (name, userId) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO companies (name, userId) VALUES (?, ?)`;
        pool.query(sql, [name, userId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

export const getCompanyById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM companies WHERE id = ?`;
        pool.query(sql, [id], (err, results) => {
            if (err) reject(err);
            resolve(results[0]);
        });
    });
};
