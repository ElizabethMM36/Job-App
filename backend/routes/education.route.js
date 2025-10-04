import express from "express";
import { upload } from "../middlewares/upload.js";
import { addEducation, getEducation } from "../controllers/education.controller.js";
import authorize from "../middlewares/authorize.js"; // ✅ Authentication middleware

const router = express.Router();

// ✅ **Add Education Details**
router.post("/add", authorize(["jobseeker"]), addEducation);

// ✅ **Upload a Single Education Certificate**
//router.post("/upload", authorize(["jobseeker"]), upload.single("certificate"), uploadCertificate);

// ✅ **Get Applicant's Education Details**
router.get("/", authorize(["jobseeker","admin"]), getEducation);

export default router;
