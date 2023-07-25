import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import tourRoute from "./routes/tour.js";
import paymentRoute from "./routes/paypal.js";
import statisticalRoute from "./routes/statistical.js";
import uploadFileRoute from "./routes/uploadFile.js";

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

app.post("/get-email", async (req, res, next) => {
  // console.log(req.body);
  try {
    const newEmail = new Email({
      ...req.body,
    });
    console.log(newEmail);
    await newEmail.save();
    res.status(200).json(newEmail);
  } catch (err) {
    next(err);
  }
});

app.get("/api/mails", async (req, res, next) => {
  try {
    const emails = await Email.find();
    res.status(200).json(emails);
  } catch (err) {
    next(err);
  }
});
app.delete("/api/mails/:id", verifyAdmin, async (req, res, next) => {
  try {
    await Email.findByIdAndDelete(req.params.id);
    res.status(200).json("Email has been deleted.");
  } catch (err) {
    next(err);
  }
});
// app.post("/api/mails", verifyAdmin, getEmail, async (req, res) => {
//   const email = req.body.mailList;
//   console.log("<<< MAIL: ", req.body);

//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "harrynguyen456@gmail.com",
//       pass: "upetskxegbycxalb",
//     },
//   });
//   // , { expiresIn: "300" }
//   const token = jwt.sign({ email }, process.env.JWT);
//   const link = `http://localhost:3005/register?token=${token}`;
//   // return;
//   await transporter.sendMail(
//     {
//       from: "harrynguyen456@gmail.com",
//       to: `${email}`,
//       // to: `19119161@student.hcmute.edu.vn`,
//       subject: req.body.title,
//       html: req.body.detail,
//       // html: link,
//     },
//     (err) => {
//       if (err) {
//         return res.json({
//           message: "errorororor",
//           err,
//         });
//       }
//       return res.json({
//         message: `da gui mail thanh cong cho tai khoan ${email}`,
//       });
//     }
//   );
// });

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/tours", tourRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/statistical', statisticalRoute);
app.use('/api/uploadFile', uploadFileRoute);
app.use('/uploads', express.static('uploads'));

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

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
