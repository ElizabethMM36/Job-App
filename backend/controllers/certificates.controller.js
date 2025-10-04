import {
  insertCertificate,
  getCertificatesByApplicant,
  getPendingCertificates,
  updateCertificateStatus,
  deleteCertificate,
} from "../models/certificates.model.js";

export const uploadCertificate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const filePath = `uploads/${req.file.filename}`;
    const applicant_id = req.user.id;

    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ success: false, message: "Only jobseekers can upload certificates" });
    }

    await insertCertificate(applicant_id, filePath, req.file.originalname);

    res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      filePath,
    });
  } catch (err) {
    console.error("Error uploading certificate:", err);
    res.status(500).json({ success: false, message: "Server error while uploading certificate" });
  }
};

export const myCertificates = async (req, res) => {
  try {
    const applicant_id = req.user.id;

    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ success: false, message: "Only jobseekers can view certificates" });
    }

    const certs = await getCertificatesByApplicant(applicant_id);
    res.json({ success: true, certificates: certs });
  } catch (err) {
    console.error("❌ myCertificates:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const listPendingCertificates = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can view pending certificates" });
    }

    const certs = await getPendingCertificates();
    res.json({ success: true, certificates: certs });
  } catch (err) {
    console.error("❌ listPendingCertificates:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can verify certificates" });
    }

    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;

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
