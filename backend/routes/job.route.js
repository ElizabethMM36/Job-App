import express from "express";
import authorize from "../middlewares/authorize.js";  // Corrected import
import { 
    postJob, 
    getAllJobs, 
    getJobById, 
    getAdminJobs, 
    applyForJob,
    getJobApplications,         // ✅ Ensure it's imported
    updateApplicationStatus,    // ✅ Ensure this is implemented and imported
getAppliedJobs} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/post", authorize(["recruiter"]), postJob);              // Authentication required for posting jobs
router.get("/get", getAllJobs);                                // Public endpoint to get all jobs
router.get("/getadminjobs", authorize(["admin"]), getAdminJobs);    // Authentication required for admin jobs
router.get("/get/:id", getJobById);                            // Public endpoint to get job by ID
router.post("/apply", authorize(["jobseeker"]), applyForJob);          // Authentication required for applying for a job

// ✅ Recruiter routes
router.get("/applications",authorize(["recruiter"]), getJobApplications);  // Authentication required to view applications
router.put("/application/status", authorize(["recruiter"]), updateApplicationStatus);  // Authentication required to update statusrouter.get("/get", authenticateUser, getAppliedJobs); 

router.get("/appliedJobs", authorize(["jobseeker"]), getAppliedJobs); 
export default router;
