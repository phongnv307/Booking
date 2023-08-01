import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getAllUser,
  searchUserByEmail
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/searchByEmail", searchUserByEmail);

router.put("/:id", updateUser);


router.delete("/:id", verifyUser, deleteUser);


router.get("/:id", getUser);


router.get("/", verifyAdmin, getUsers);

router.post('/search', getAllUser);


export default router;
