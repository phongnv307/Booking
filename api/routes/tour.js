import express from "express";
import { getTour, updateBookingTour, getBookingTourById, getTours, getBookingTourByCompany, createTour, getTourByCompany, deleteTour, updateTour, searchTourByName, searchTourByNameAdmin, bookingTour, getBookingTour } from "../controllers/tour.js";
import { verifyAdmin, authenticateToken } from "../utils/verifyToken.js"

const router = express.Router();

//Company
router.post("/book", bookingTour);

router.get("/getTourByCompany", authenticateToken, getTourByCompany);

router.get("/searchByNameCompany", authenticateToken, searchTourByName);

router.get("/searchByNameAdmin", searchTourByNameAdmin);

router.get("/bookedByAdmin", getBookingTour);

router.get("/bookByCompany", authenticateToken, getBookingTourByCompany);

router.get("/getBookingById/:id", getBookingTourById);

router.put("/book/:id", updateBookingTour);

// GET ONE tour
router.get("/:id", getTour);

// GET all tour
router.get("/", getTours);

// Create tour
router.post("/", authenticateToken, createTour);

router.delete("/:id", deleteTour);

router.put("/:id", updateTour);


export default router;
