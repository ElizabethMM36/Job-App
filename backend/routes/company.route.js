import express from "express";
import { registerCompany, getCompanyById, getCompany, updateCompany } from "../controllers/company.controller.js";
import  authenticateUser  from "../middlewares/isAuthenticated.js"; 

const router = express.Router();

router.post("/register", authenticateUser, registerCompany);
router.get("/:id", authenticateUser, getCompanyById);
router.get("/", authenticateUser, getCompany);
router.put("/:id", authenticateUser, updateCompany);

export default router;
