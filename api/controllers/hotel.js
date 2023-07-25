import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import jwt from "jsonwebtoken";

export const createHotel = async (req, res, next) => {
  const { name, type, city, address, photos, title, desc, rating, rooms, cheapestPrice, review, visible, utilities } = req.body;
  const decodedToken = jwt.verify(req.headers.authorization, process.env.JWT);
  const createdBy = decodedToken.id
  console.log(decodedToken);

  try {
    const hotel = await Hotel.create({ createdBy, name, type, city, address, photos, title, desc, rating, rooms, cheapestPrice, review, visible, utilities });
    await Room.updateMany(
      { _id: { $in: rooms } }, 
      { $set: { booked: true } } 
    );
    res.status(201).json(hotel);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create hotel" });
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate("rooms");

    if (hotel && hotel.rooms && hotel.rooms.length > 0) {
      hotel.rooms = hotel.rooms.filter(room => room.visible === true);
    }

    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

export const getHotels = async (req, res, next) => {
  const { min, max, city, type, featured, people, visible } = req.query;

  let filterObj;
  if (city && type && visible) {
    filterObj = {
      city,
      type,
      visible,
      cheapestPrice: { $gt: min || 1, $lt: max || 999 },
    };
  } else if (city && !type && visible) {
    filterObj = {
      city,
      visible,
      cheapestPrice: { $gt: min || 1, $lt: max || 999 },
    };
  } else if (!city && type && visible) {
    filterObj = {
      type,
      visible,
      cheapestPrice: { $gt: min || 1, $lt: max || 999 },
    };
  } else if (featured) {
    filterObj = { featured };
  }
  try {
    console.log(filterObj);
    const hotels = await Hotel.find({
      ...filterObj,

    })
      .limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

// export const getHotels = async (req, res, next) => {
//   const { min, max, city, type, featured, people } = req.query;

//   let filterObj;
//   if (city && type) {
//     filterObj = {
//       city,
//       type,
//       visible,
//       cheapestPrice: { $gt: min || 1, $lt: max || 999 },
//     };
//   } else if (city && !type) {
//     filterObj = {
//       city,
//       cheapestPrice: { $gt: min || 1, $lt: max || 999 },
//     };
//   } else if (!city && type) {
//     filterObj = {
//       type,
//       cheapestPrice: { $gt: min || 1, $lt: max || 999 },
//     };
//   } else if (featured) {
//     filterObj = { featured };
//   }
//   try {
//     console.log(filterObj);
//     const hotels = await Hotel.find({
//       ...filterObj,

//     }).limit(req.query.limit);
//     res.status(200).json(hotels);
//   } catch (err) {
//     next(err);
//   }
// };

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city, visible: true });
      })
    );
    const citiesCount = cities.map((city, idx) => {
      {
        return { city: `${city}`, counted: `${list[idx]}` };
      }
    });
    res.status(200).json(citiesCount);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });
    const cottageCount = await Hotel.countDocuments({ type: "cottage" });
    const vacationHomeCount = await Hotel.countDocuments({
      type: "vacationhome",
    });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartment", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "cabin", count: cabinCount },
      { type: "cottage", count: cabinCount },
      { type: "vacation home", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const searchHotelsByName = async (req, res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, 'i'); // Tạo biểu thức chính quy không phân biệt chữ hoa chữ thường
    console.log(regex);
    const hotels = await Hotel.find({ title: regex, createdBy: req.user.id });
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search hotels' });
  }
}

export const searchHotelsByNameAdmin = async (req, res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, 'i'); // Tạo biểu thức chính quy không phân biệt chữ hoa chữ thường
    console.log(regex);
    const hotels = await Hotel.find({ title: regex });
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search hotels' });
  }
}

export const getHotelsCompany = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ createdBy: req.user.id });
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
}

export const addCommentAndRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Create a new comment object
    const newComment = {
      comment,
      rating,
    };

    // Add the new comment to the hotel's review array
    hotel.review.push(newComment);

    // Update the hotel's rating based on the new comment
    const totalRating = hotel.review.reduce((sum, review) => sum + review.rating, 0);
    hotel.rating = totalRating / hotel.review.length;

    await hotel.save();

    return res.json(hotel);
  } catch (error) {
    console.error('Error adding comment and rating:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};