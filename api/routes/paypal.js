import express from "express";
import { payment, executePayment } from "../controllers/paypal.js";
import { verifyAdmin, authenticateToken } from "../utils/verifyToken.js"

const router = express.Router();

router.post("/pay", payment);

router.get("/executePayment", executePayment);


export default router;
