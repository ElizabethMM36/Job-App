import pool from '../utils/db.js';

export const insertCertificate = async (applicant_id ,file_url, name = null) =>{
    const q = `INSERT INTO certificates (applicant_id , file_url,name) VALUES(?,?,?)`;
    const [result] = await pool.query(q,[applicant_id,file_url,name]);
    return result.insertId;
};

export const getCertificatesByApplicant = async (applicant_id) =>{
    const q = `SELECT * FROM certificates WHERE applicant_id =?`;
    const [rows] = await pool.query(q,[applicant_id]);
    return rows;
};
export const getPendingCertificates = async() =>{
    const q = `SELECT c.*, ja.full_name, ja.email FROM certificates c JOIN job_applicants ja ON c.applicant_id = ja.applicant_id WHERE c.status = 'pending'`;
  const [rows] = await pool.query(q);
  return rows;
};

export const updateCertificateStatus = async (id, status, adminId = null) => {
  const q = `UPDATE certificates SET status = ?, verified_by = ?, verified_at = ? WHERE id = ?`;
  const verifiedAt = status === 'verified' ? new Date() : null;
  const [res] = await pool.query(q, [status, adminId, verifiedAt, id]);
  return res;
};
export const deleteCertificate = async (id) => {
  const q = `DELETE FROM certificates WHERE id = ?`;
  const [res] = await pool.query(q, [id]);
  return res;
};