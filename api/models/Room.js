import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false
    },
    booked: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    typeRooms: {
      type: String,
      required: true,
    },
    roomQuantity: {
      type: Number,
      required: true,
    },
    roomOrder: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
