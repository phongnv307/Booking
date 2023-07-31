import mongoose from "mongoose";
const TourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    desc: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    schedule: {
      type: [String],
      required: true,
    },
    hightlight: {
      type: [String],
      required: true,
    },
    trip: {
      type: [String],
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    departure: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    vehicles: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

export default mongoose.model("Tour", TourSchema);
