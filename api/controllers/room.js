import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import BookingRooms from "../models/BookingRooms.js";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  const decodedToken = jwt.verify(req.headers.authorization, process.env.JWT);
  const createdBy = decodedToken.id;
  const roomOrder = 0;
  const booked = false;
  try {
    const { title, price, maxPeople, desc, typeRooms, roomQuantity } = req.body;
    const room = new Room({ title, price, maxPeople, desc, createdBy, typeRooms, roomQuantity, roomOrder, booked });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Tạo room thất bại' });
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};
export const deleteRoom = async (req, res, next) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json("Rooms has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

export const getRoomsByCompany = async (req, res, next) => {
  try {
    const rooms = await Room.find({ createdBy: req.user.id, visible: true });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}

export const getRoomsByAllCompany = async (req, res, next) => {
  try {
    const rooms = await Room.find({ createdBy: req.user.id});
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}

export const searchRoomsByName = async (req,res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, 'i'); // Tạo biểu thức chính quy không phân biệt chữ hoa chữ thường
    console.log(regex);
    const hotels = await Room.find({ title: regex, createdBy: req.user.id });
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search hotels' });
  }
}

export const searchRoomsByNameAdmin = async (req,res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, 'i'); // Tạo biểu thức chính quy không phân biệt chữ hoa chữ thường
    console.log(regex);
    const hotels = await Room.find({ title: regex });
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search hotels' });
  }
}

export const bookingRooms = async (req, res) => {
  try {
    const { roomId, userId, bookingDetails, billing, checkInDate, checkOutDate } = req.body;

    // Check if the room is available for booking in the given date range
    const existingBooking = await BookingRooms.findOne({
      room: roomId,
      checkInDate: { $lte: new Date(checkOutDate) },
      checkOutDate: { $gte: new Date(checkInDate) }
    });

    if (existingBooking) {
      return res.status(200).json({ message: 'Room is already booked for the selected dates' });
    }

    const rooms = await Room.findById(roomId);

    if (!rooms) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    console.log()

    // Check if roomOrder is greater than or equal to roomQuantity
    if (isNaN(rooms.roomOrder) || isNaN(rooms.roomQuantity) || rooms.roomOrder >= rooms.roomQuantity) {
      return res.status(400).json({ message: 'Room is fully booked' });
    }

    const booking = new BookingRooms({
      room: roomId,
      user: userId,
      details: bookingDetails,
      billing: billing,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate)
    });

    await booking.save();

    // Increment the roomOrder by 1 for the booked room
    rooms.roomOrder += 1;
    await rooms.save();

    return res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const getBookingRooms = async (req, res) => {
  try {
    const bookings = await BookingRooms.find().populate('room').populate('user');

    return res.json( bookings );
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const getBookingRoomsByCompany = async (req, res) => {
  try {
    console.log(req.user.id);
    // Tìm danh sách các booking dựa trên createdBy trong tour
    const bookings = await BookingRooms.find()
    .populate({
      path: 'room',
      match: { createdBy: req.user.id },
      populate: { path: 'createdBy', model: 'User' }, // Nạp thông tin của người tạo tour
    })
      .populate('user');

    const filteredBookings = bookings.filter(
      (booking) => booking.room !== null // Lọc ra các booking có tour không null
    );

    console.log(filteredBookings);

    return res.json(filteredBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookingRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const bookingRoom = await BookingRooms.findById(id);

    if (!bookingRoom) {
      return res.status(404).json({ message: 'Booking room not found' });
    }

    return res.json(bookingRoom);
  } catch (error) {
    console.error('Error fetching booking room:', error);
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