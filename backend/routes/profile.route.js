import express from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";

import authorize from "../middlewares/authorize.js";

const router = express.Router();

// ✅ **Get User Profile** (GET /api/profile/:email)
router.get("/", authorize(["jobseeker","recruiter","admin"]), getProfile);
// ✅ **Update User Profile** (PUT /api/profile/update)
router.put("/update", authorize(["jobseeker","recruiter","admin"]), async (req, res, next) => {
    try {
        await updateProfile(req, res);
    } catch (error) {
        next(error);
    }
});

// ✅ **404 Handler for Unmatched Routes**
router.use((req, res) => {
    res.status(404).json({ success: false, message: "Profile route not found" });
});

export default router;
