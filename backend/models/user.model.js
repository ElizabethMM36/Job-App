import pool from "../utils/db.js";

// Create a new user
export const createUser = async (user) => {
    const { fullname, email, phoneNumber, password, role, profilePhoto } = user;
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (fullname, email, phoneNumber, password, role, profilePhoto) VALUES (?, ?, ?, ?, ?, ?)`;
        pool.query(sql, [fullname, email, phoneNumber, password, role, profilePhoto], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Get user by email
export const getUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE email = ?`;
        pool.query(sql, [email], (err, results) => {
            if (err) reject(err);
            resolve(results[0]);
        });
    });
};

// Get user by ID
export const getUserById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE id = ?`;
        pool.query(sql, [id], (err, results) => {
            if (err) reject(err);
            resolve(results[0]);
        });
    });
};

// Update user profile
export const updateUser = async (id, updateData) => {
    const { fullname, email, phoneNumber, profilePhoto, bio, skills } = updateData;
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET fullname = ?, email = ?, phoneNumber = ?, profilePhoto = ?, bio = ?, skills = ? WHERE id = ?`;
        pool.query(sql, [fullname, email, phoneNumber, profilePhoto, bio, skills, id], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Delete user
export const deleteUser = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM users WHERE id = ?`;
        pool.query(sql, [id], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};
