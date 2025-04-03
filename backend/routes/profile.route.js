import express from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import authenticate from "../middlewares/isAuthenticated.js"; 
// ✅ Ensure correct path

const router = express.Router();

// ✅ **Get User Profile**
router.get("/", authenticate, async (req, res, next) => {
    try {
        await getProfile(req, res);
    } catch (error) {
        next(error); // Pass error to Express error handler
    }
});

// ✅ **Update User Profile**
router.put("/update", authenticate, async (req, res, next) => {
    try {
        await updateProfile(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
