import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bookingRoomRoute from "./routes/bookingrooms.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import { createError } from "./utils/error.js";
import { verifyAdmin } from "./utils/verifyToken.js";
import nodemailer from "nodemailer";
import multiparty from "connect-multiparty";
import morgan from "morgan";
import fs from "fs";
import * as Cloudinary from "cloudinary";
// Return "https" URLs by setting secure: true

const MultiPartyMiddleware = multiparty({ uploadDir: "./images" });

const app = express();
dotenv.config();

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

// app.use(express.static("uploads"));
app.use(cookieParser());
app.use(express.json());
// app.use(multiparty({ uploadDir: "./images" }));

// app.use("/images", express.static("images"));
app.use(express.static('public'));

app.use("/api/booking-rooms", bookingRoomRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8801, () => {
  connect();
  console.log("Connected to backend.");
});
