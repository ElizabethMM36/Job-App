import express from "express";
import authorize from  "../middlewares/authorize.js";

import { getPendingCertificatesController, verifyCertificateController, approveRecruiterController,getPendingRecruitersController } from "../controllers/admin.controller.js";
 const router = express.Router();
 router.get("/certificates/pending", authorize(["admin"]), getPendingCertificatesController);
router.post("/certificates/verify", authorize(["admin"]), verifyCertificateController);
router.get("/pending", authorize(["admin"]), getPendingRecruitersController);
router.post("/verify", authorize(["admin"]), approveRecruiterController);

export default router;