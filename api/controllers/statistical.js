import UserModel from '../models/User.js';
import HotelModel from '../models/Hotel.js';
import TourModel from '../models/Tour.js';
import RoomModel from '../models/Room.js';
import BookingRoomModel from '../models/BookingRooms.js';
// import OrderModel from '../models/order';
import StatisticalModel from '../models/statistical.js';

export const getAllStatistical = async (req, res, next) => {
    try {
        const statistical = await StatisticalModel.find();

        // Đếm số lượng user và sản phẩm trong cơ sở dữ liệu MongoDB
        const userCountPromise = UserModel.countDocuments();
        const hotelCountPromise = HotelModel.countDocuments();
        const tourCountPromise = TourModel.countDocuments();
        const orderCountPromise = BookingRoomModel.countDocuments();
        const result = {};
        
        // Sử dụng Promise.all để chờ cả hai Promise hoàn thành
        Promise.all([userCountPromise, hotelCountPromise, tourCountPromise, orderCountPromise])
            .then((results) => {
                const [userCount, hotelCount, tourCount, orderCount] = results;
                const data = [
                    { name: "Tháng 1", Total: 0 },
                    { name: "Tháng 2", Total: 0 },
                    { name: "Tháng 3", Total: 0 },
                    { name: "Tháng 4", Total: 0 },
                    { name: "Tháng 5", Total: 0 },
                    { name: "Tháng 6", Total: 3 },
                    { name: "Tháng 7", Total: 6 },
                    { name: "Tháng 8", Total: 1 },
                    { name: "Tháng 9", Total: 4 },
                    { name: "Tháng 10", Total: 0 },
                    { name: "Tháng 11", Total: 0 },
                    { name: "Tháng 12", Total: 0 }
                ];


                const result = {
                    userTotal: userCount,
                    hotelTotal: hotelCount,
                    tourTotal: tourCount,
                    orderTotal: orderCount,
                    data
                };
                res.status(200).json({ data: result });
            })
            .catch((error) => {
                console.log(error);
            });

    } catch (err) {
        res.status(500).json(err);
    }
};

export const getAllStatisticalCompany = async (req, res, next) => {
    try {
        const statistical = await StatisticalModel.find();

        // Đếm số lượng user và sản phẩm trong cơ sở dữ liệu MongoDB
        const userId = req.user.id; // ID của user đang thực hiện yêu cầu

        const userHotelCountPromise = HotelModel.countDocuments({ createdBy: userId });
        const userTourCountPromise = TourModel.countDocuments({ createdBy: userId });
        const userRoomsCountPromise = RoomModel.countDocuments({ createdBy: userId });
        const result = {};
        // Sử dụng Promise.all để chờ cả hai Promise hoàn thành
        Promise.all([userHotelCountPromise, userTourCountPromise, userRoomsCountPromise])
            .then((results) => {
                const [hotelCount, tourCount, roomsCount] = results;
                const data = [
                    { name: "Tháng 1", Total: 0 },
                    { name: "Tháng 2", Total: 0 },
                    { name: "Tháng 3", Total: 0 },
                    { name: "Tháng 4", Total: 0 },
                    { name: "Tháng 5", Total: 0 },
                    { name: "Tháng 6", Total: 3 },
                    { name: "Tháng 7", Total: 6 },
                    { name: "Tháng 8", Total: 1 },
                    { name: "Tháng 9", Total: 4 },
                    { name: "Tháng 10", Total: 0 },
                    { name: "Tháng 11", Total: 0 },
                    { name: "Tháng 12", Total: 0 }
                ];

                const result = {
                    userTotal: 0,
                    hotelTotal: hotelCount,
                    tourTotal: tourCount,
                    roomsTotal: roomsCount,
                    orderTotal: 0,
                    data
                };
                res.status(200).json({ data: result });
            })
            .catch((error) => {
                console.log(error);
            });

    } catch (err) {
        res.status(500).json(err);
    }
};