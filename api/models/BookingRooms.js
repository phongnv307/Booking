import mongoose from 'mongoose';

const BookingRoomsSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    billing: {
      type: String,
      enum: ['cash', 'paypal'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
  },
  { timestamps: true }
);

const BookingRooms = mongoose.model('BookingRooms', BookingRoomsSchema);

export default BookingRooms;
