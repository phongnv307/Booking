import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
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

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;