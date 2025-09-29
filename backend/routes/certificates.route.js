import express from "express";
import authorize from "../middlewares/authorize.js";
import {
  uploadCertificate,
  myCertificates,
  listPendingCertificates,
  verifyCertificate,
  removeCertificate,
} from "../controllers/certificates.controller.js";

import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Applicant routes
router.post("/upload", authorize(["jobseeker"]), singleUpload, uploadCertificate);
router.get("/my", authorize(["jobseeker"]), myCertificates);

// Admin routes
router.get("/pending", authorize(["admin"]), listPendingCertificates);
router.put("/:id/status", authorize(["admin"]), verifyCertificate);
router.delete("/:id", authorize(["admin"]), removeCertificate);

export default router;
