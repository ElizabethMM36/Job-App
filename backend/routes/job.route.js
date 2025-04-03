import express from "express";
import authenticateUser  from "../middlewares/isAuthenticated.js";  // Ensure correct import
import { postJob, getAllJobs, getJobById, getAdminJobs } from "../controllers/job.controller.js";

const router = express.Router();

router.post("/post", authenticateUser, postJob);
router.get("/get", getAllJobs);
router.get("/getadminjobs", authenticateUser, getAdminJobs);
router.get("/get/:id", getJobById);

export default router;
