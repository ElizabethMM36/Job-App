import {
  insertCertificate,
  getCertificatesByApplicant,
  getPendingCertificates,
  updateCertificateStatus,
  deleteCertificate,
} from "../models/certificates.model.js";

export const uploadCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Use relative path for DB
    const filePath = `uploads/${req.file.filename}`;
    const applicant_id = req.user.applicant_id;
console.log("Applicant ID:", applicant_id);
console.log("File path:", filePath);
console.log("Original name:", req.file.originalname);

    await insertCertificate(applicant_id, filePath, req.file.originalname);

    res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      filePath, // send relative path to frontend
    });
  } catch (err) {
    console.error("Error uploading certificate:", err);
    res.status(500).json({
      success: false,
      message: "Server error while uploading certificate",
    });
  }
};
export const myCertificates = async (req, res) => {
  try {
    const { applicant_id } = req.user.applicant_id;
    const certs = await getCertificatesByApplicant(applicant_id);
    res.json({ success: true, certificates: certs });
  } catch (err) {
    console.error("❌ myCertificates:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const listPendingCertificates = async (req, res) => {
  try {
    const certs = await getPendingCertificates();
    res.json({ success: true, certificates: certs });
  } catch (err) {
    console.error("❌ listPendingCertificates:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { id } = req.params; // certificate id
    const { status } = req.body;
    const adminId = req.user.id; // from token

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await updateCertificateStatus(id, status, adminId);
    res.json({ success: true, message: `Certificate ${status}` });
  } catch (err) {
    console.error("❌ verifyCertificate:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const removeCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCertificate(id);
    res.json({ success: true, message: "Certificate deleted" });
  } catch (err) {
    console.error("❌ removeCertificate:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};
