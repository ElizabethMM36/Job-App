// controllers/admin.controller.js
import { setRecruiterStatus, setUserStatus } from "../models/recruiters.model.js";
import { updateCertificateStatus, getPendingCertificates } from "../models/certificates.model.js";
import { getRecruiterByIdFromDB } from "../models/recruiters.model.js";

export const getPendingCertificatesController = async (req, res) => {
  try {
    const rows = await getPendingCertificates();
    return res.json({ pending: rows, success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const verifyCertificateController = async (req, res) => {
  try {
    const { certificateId, action } = req.body; // action: 'verify' or 'reject'
    if (!certificateId || !['verify','reject'].includes(action)) return res.status(400).json({ message: "Invalid input", success: false });

    const status = action === 'verify' ? 'verified' : 'rejected';
    await updateCertificateStatus(certificateId, status, req.user.id);

    return res.json({ message: `Certificate ${status}`, success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const approveRecruiterController = async (req, res) => {
  try {
    const { recruiterUserId, action } = req.body; // action: 'approve' or 'reject'
    if (!recruiterUserId || !['approve','reject'].includes(action)) return res.status(400).json({ message: "Invalid input", success: false });

    const status = action === 'approve' ? 'approved' : 'rejected';
    // update recruiters table (if exists) and users table
    await setRecruiterStatus(recruiterUserId, status);
    await setUserStatus(recruiterUserId, status);

    return res.json({ message: `Recruiter ${status}`, success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
