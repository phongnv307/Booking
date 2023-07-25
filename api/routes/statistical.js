import express from "express";
import { getAllStatistical, getAllStatisticalCompany } from "../controllers/statistical.js";
import {verifyAdmin, authenticateToken} from "../utils/verifyToken.js"

const router = express.Router();

// Get by admin
router.get("/count", getAllStatistical);

// Get by Company
router.get("/countByCompany", authenticateToken, getAllStatisticalCompany)

export default router;
