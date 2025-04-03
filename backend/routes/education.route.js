import express from "express";
import { upload } from "../middlewares/upload.js";
import { addEducation, uploadCertificate, getEducation } from "../controllers/education.controller.js";
import authenticate from "../middlewares/isAuthenticated.js"; // ✅ Corrected import

const router = express.Router();

// ✅ **Add Education Details**
router.post("/add", authenticate, addEducation);

// ✅ **Upload Education Certificates**
router.post("/upload", authenticate, upload.array("certificates", 5), uploadCertificate);

// ✅ **Get Applicant's Education Details**
router.get("/", authenticate, getEducation);

export default router;
