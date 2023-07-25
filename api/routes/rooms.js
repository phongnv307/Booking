import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
  getRoomsByCompany,
  searchRoomsByName,
  searchRoomsByNameAdmin,
  bookingRooms,
  getBookingRooms,
  getBookingRoomsByCompany,
  getBookingRoomById,
  updateBookingRoom,
  getRoomsByAllCompany
} from "../controllers/room.js";
import { verifyAdmin, authenticateToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", getRooms);

router.get("/getRoomsByAllCompany",authenticateToken, getRoomsByAllCompany);


router.get("/getRoomsByCompany",authenticateToken, getRoomsByCompany);

router.get("/searchByNameCompany", authenticateToken, searchRoomsByName);

router.get("/searchByNameAdmin", searchRoomsByNameAdmin);

router.post("/book", bookingRooms);

router.get("/getBookingById/:id", getBookingRoomById);

router.put("/book/:id", updateBookingRoom);


router.get("/bookedByAdmin", getBookingRooms);

router.get("/bookByCompany", authenticateToken, getBookingRoomsByCompany);

//CREATE
router.post("/",authenticateToken, createRoom);

//UPDATE
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id", updateRoom);
//DELETE
router.delete("/:id/", deleteRoom);

//GET

router.get("/:id", getRoom);
//GET ALL


export default router;
