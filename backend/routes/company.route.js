import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { registerCompany, getCompany, getCompanyById, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", isAuthenticated, registerCompany);
router.get("/get", getCompany);
router.get("/get/:id", getCompanyById);
router.put("/update/:id", isAuthenticated, singleUpload, updateCompany);

export default router;


