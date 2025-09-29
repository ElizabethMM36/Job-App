import express from "express";
import authorize from  "../middleware/authorize.js";
import { getPendingCertificatesController, verifyCertificateController, approveRecruiterController } from "../controllers/admin.controller.js";
 const router = express.Router();
 router.get("/certificates/pending", authorize(["admin"]), getPendingCertificatesController);
router.post("/certificates/verify", authorize(["admin"]), verifyCertificateController);
router.post("/recruiters/verify", authorize(["admin"]), approveRecruiterController);

export default router;