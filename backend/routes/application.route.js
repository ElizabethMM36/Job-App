import express from "express"; 
import  authenticateUser from "../middlewares/isAuthenticated.js";  
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/apply/:id", authenticateUser, applyJob);  // ✅ Corrected
router.get("/get", authenticateUser, getAppliedJobs);  
router.get("/:id/applicants", authenticateUser, getApplicants);  
router.post("/status/:id/update", authenticateUser, updateStatus);  

export default router;
