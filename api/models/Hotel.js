import mongoose from "mongoose";
const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
  },

  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  rooms:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  cheapestPrice: {
    type: Number,
    required: true,
  },
  review: {
    type: [Object],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  utilities: {
    type: [String], 
  },
});

export default mongoose.model("Hotel", HotelSchema)