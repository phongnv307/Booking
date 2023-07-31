import express from "express";
import { login, register } from "../controllers/auth.js";
import { parseToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register",  register);
router.post("/admin/register", register);
router.post("/login", login);
export default router;
