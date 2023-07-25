import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: false,
    },
    country: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    },
  },
  { timestamps: true }
);
UserSchema.plugin(mongoosePaginate);
export default mongoose.model("User", UserSchema);
