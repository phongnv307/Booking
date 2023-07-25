import express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotelRooms,
  getHotels,
  updateHotel,
  searchHotelsByName,
  getHotelsCompany,
  searchHotelsByNameAdmin,
  addCommentAndRating
} from "../controllers/hotel.js";
import Hotel from "../models/Hotel.js";
import {verifyAdmin, authenticateToken} from "../utils/verifyToken.js"
const router = express.Router();

//CREATE
router.post("/addCommentAndRating/:id", addCommentAndRating);

router.post("/",createHotel);

//UPDATE
router.put("/:id", updateHotel);

//DELETE
router.delete("/:id", deleteHotel);
//GET

router.get("/find/:id", getHotel);
//GET ALL

router.get("/", getHotels);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);

router.get("/searchByNameCompany", authenticateToken, searchHotelsByName);

router.get("/searchByNameAdmin", searchHotelsByNameAdmin);

// Company
router.get("/getHotelByCompany", authenticateToken, getHotelsCompany);


export default router;
