import BookingRooms from "../models/BookingRooms.js";
import { where, Sequelize } from "sequelize"
const Op = Sequelize.Op;

export const getAvailbleRoom = async (req, res, next) => {
  const { roomId, checkInDate, checkOutDate } = req.query;
  console
  if (!roomId || !checkInDate || !checkOutDate) res.status(400).send({ message: "Wrong information!" })
  console.log(roomId, new Date(Number(checkInDate)), new Date(Number(checkOutDate)))
  try {
    const countBooked = await BookingRooms.count({
      room: roomId,
      checkInDate: { $lte: new Date(Number(checkOutDate)) },
      checkOutDate: { $gte: new Date(Number(checkInDate)) }, 
      status:"approved"
    }
    );

    res.status(200).json(countBooked);
  } catch (err) {
    next(err);
  }
};

export const bookingRooms = async (req, res) => {
  try {
    const { room, user, details, billing, status, checkInDate, checkOutDate, total } = req.body;


    const booking = new BookingRooms({
      room: room,
      user: user,
      details: details,
      billing: billing,
      status: status,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      total: total
    });

    await booking.save();

    // Increment the roomOrder by 1 for the booked room

    return res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBookingRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const {status } = req.body;

    const updatedBookingRoom = await BookingRooms.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    if (!updatedBookingRoom) {
      return res.status(404).json({ message: 'Booking room not found' });
    }

    return res.json(updatedBookingRoom);
  } catch (error) {
    console.error('Error updating booking room:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};