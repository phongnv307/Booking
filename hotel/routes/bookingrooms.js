import express from "express";
import {
  getAvailbleRoom,
  bookingRooms,
  updateBookingRoom
} from "../controllers/bookingrooms.js";
const router = express.Router();
// get available room
router.get("/available-room", getAvailbleRoom);

//CREATE
router.post("/book", bookingRooms);

// router.post("/addCommentAndRating/:id", addCommentAndRating);
router.put("/book/:id", updateBookingRoom);



export default router;
