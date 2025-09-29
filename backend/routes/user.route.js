import express from "express";
import {
    login,
    logout,
    register,
    updateProfile,
    getAllApplicants,
    getApplicantById
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js"; // ✅ Fixed multer import
import authorize from "../middlewares/authorize.js";
const router = express.Router();

// **User Registration (Includes Applicant + Education Upload)**
router.post("/register", singleUpload, register);

// **User Login**
router.post("/login", login);

// **User Logout**
router.get("/logout", logout);
router.post("/logout", logout);

// **Update Profile**
router.post("/profile/update", authorize(["jobseeker"]), singleUpload, updateProfile);

// **Get All Applicants** (Protected Route)
router.get("/applicants",authorize(["admin"]), getAllApplicants);
router.get("/applicants",authorize(["recruiter"]), getAllApplicants);

// ✅ **Get Single Applicant by ID (with Education)**
router.get("/applicants/:id", authorize(["admin"]), getApplicantById);
router.get("/applicants/:id", authorize(["recruiter"]), getApplicantById);

export default router;
