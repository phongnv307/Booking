import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";
import jwt from "jsonwebtoken";

export const getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json(tour);
  } catch (err) {
    next(err);
  }
};

export const getTours = async (req, res, next) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (err) {
    next(err);
  }
};

// export const createTour = async (req, res, next) => {
//   const { title,photos,price,address,rating,desc,text,schedule,hightlight,trip,time,departure,destination,vehicles} = req.body;
//   const createdBy = req.user.id; // Lấy ID của người dùng hiện tại từ xác thực
//   const tour = new Tour({title,photos,price,address,rating,desc,text,schedule,hightlight,trip,time,departure,destination,vehicles,createdBy});
  
//   tour.save()
//   .then((createdTour) => {
//     res.status(201).json(createdTour);
//   })
//   .catch((error) => {
//     res.status(500).json({ error: "Failed to create tour" });
//   });
// };

export const createTour = async (req, res, next) => {
  const decodedToken = jwt.verify(req.headers.authorization, process.env.JWT);
  const createdBy = decodedToken.id;
  console.log(createdBy);
  console.log(1);
  const rating = 9;
  try {
    const { title, photos, price, address, desc, text, schedule, hightlight, trip, time, departure, destination, vehicles} = req.body;
    const tour = new Tour({ title, photos, price, address, rating, desc, text, schedule, hightlight, trip, time, departure, destination, vehicles, createdBy});
    await tour.save();
    res.status(201).json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create tour" });
  }
};

export const getTourByCompany = async (req, res, next) => {
  try {
    const tours = await Tour.find({ createdBy: req.user.id });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
}

export const deleteTour = async (req, res) => {
  try {
      const user = await Tour.findByIdAndDelete(req.params.id);
      if (!user) {
          return res.status(200).json("Tour does not exist");
      }
      res.status(200).json("Delete tour success");
  } catch (err) {
      res.status(500).json(err);
  }
}

export const updateTour = async (req,res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTour);
  } catch (err) {
    next(err);
  }
}

export const searchTourByName = async (req,res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, 'i'); // Tạo biểu thức chính quy không phân biệt chữ hoa chữ thường
    console.log(regex);
    const tours = await Tour.find({ title: regex, createdBy: req.user.id });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search tours' });
  }
}

export const searchTourByNameAdmin = async (req,res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, 'i'); // Tạo biểu thức chính quy không phân biệt chữ hoa chữ thường
    console.log(regex);
    const tours = await Tour.find({ title: regex });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search tours' });
  }
}

export const bookingTour = async (req, res) => {
  try {
    const { tourId, userId, bookingDetails, billing, departureDate, people, total } = req.body;

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const booking = new Booking({
      tour: tourId,
      user: userId,
      details: bookingDetails,
      billing: billing,
      departureDate: new Date(departureDate),
      people: people,
      total: total
    });

    await booking.save();

    return res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const getBookingTour = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('tour').populate('user');

    return res.json( bookings );
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const getBookingTourByCompany = async (req, res) => {
  try {
    console.log(req.user.id);
    // Tìm danh sách các booking dựa trên createdBy trong tour
    const bookings = await Booking.find()
    .populate({
      path: 'tour',
      match: { createdBy: req.user.id },
      populate: { path: 'createdBy', model: 'User' }, // Nạp thông tin của người tạo tour
    })
      .populate('user');

    const filteredBookings = bookings.filter(
      (booking) => booking.tour !== null // Lọc ra các booking có tour không null
    );

    return res.json(filteredBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookingTourById = async (req, res) => {
  try {
    const { id } = req.params;

    const bookingTour = await Booking.findById(id);

    if (!bookingTour) {
      return res.status(404).json({ message: 'Booking tour not found' });
    }

    return res.json(bookingTour);
  } catch (error) {
    console.error('Error fetching booking tour:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBookingTour = async (req, res) => {
  try {
    const { id } = req.params;
    const {status } = req.body;

    const updatedBookingTour = await Booking.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    if (!updatedBookingTour) {
      return res.status(404).json({ message: 'Booking tour not found' });
    }

    return res.json(updatedBookingTour);
  } catch (error) {
    console.error('Error updating booking tour:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
