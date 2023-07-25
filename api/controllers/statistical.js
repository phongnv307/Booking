import UserModel from '../models/User.js';
import HotelModel from '../models/Hotel.js';
import TourModel from '../models/Tour.js';
import RoomModel from '../models/Room.js';
// import OrderModel from '../models/order';
import StatisticalModel from '../models/statistical.js';

export const getAllStatistical = async (req, res, next) => {
    try {
        const statistical = await StatisticalModel.find();

        // Đếm số lượng user và sản phẩm trong cơ sở dữ liệu MongoDB
        const userCountPromise = UserModel.countDocuments();
        const hotelCountPromise = HotelModel.countDocuments();
        const tourCountPromise = TourModel.countDocuments();
        // const currentDate = new Date();
        // const last12Months = new Date(currentDate.setMonth(currentDate.getMonth() - 11));
        // const orderCountPromise = OrderModel.aggregate([
        //     {
        //         $match: {
        //             createdAt: {
        //                 $gte: last12Months,
        //                 $lte: new Date()
        //             }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: { $month: "$createdAt" },
        //             total: { $sum: 1 }
        //         }
        //     }
        // ]);
        const result = {};
        
        // Sử dụng Promise.all để chờ cả hai Promise hoàn thành
        Promise.all([userCountPromise, hotelCountPromise, tourCountPromise])
            .then((results) => {
                const [userCount, hotelCount, tourCount, ] = results;
                const data = [
                    { name: "Tháng 1", Total: 1 },
                    { name: "Tháng 2", Total: 0 },
                    { name: "Tháng 3", Total: 2 },
                    { name: "Tháng 4", Total: 0 },
                    { name: "Tháng 5", Total: 4 },
                    { name: "Tháng 6", Total: 0 },
                    { name: "Tháng 7", Total: 0 },
                    { name: "Tháng 8", Total: 0 },
                    { name: "Tháng 9", Total: 0 },
                    { name: "Tháng 10", Total: 0 },
                    { name: "Tháng 11", Total: 8 },
                    { name: "Tháng 12", Total: 0 }
                ];

                // orderCount.forEach(item => {
                //     const month = item._id;
                //     const total = item.total;
                //     data[month - 1].Total = total;
                // });

                const result = {
                    userTotal: userCount,
                    hotelTotal: hotelCount,
                    tourTotal: tourCount,
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

export const getAllStatisticalCompany = async (req, res, next) => {
    try {
        const statistical = await StatisticalModel.find();

        // Đếm số lượng user và sản phẩm trong cơ sở dữ liệu MongoDB
        const userId = req.user.id; // ID của user đang thực hiện yêu cầu

        const userHotelCountPromise = HotelModel.countDocuments({ createdBy: userId });
        const userTourCountPromise = TourModel.countDocuments({ createdBy: userId });
        const userRoomsCountPromise = RoomModel.countDocuments({ createdBy: userId });
        // const currentDate = new Date();
        // const last12Months = new Date(currentDate.setMonth(currentDate.getMonth() - 11));
        // const orderCountPromise = OrderModel.aggregate([
        //     {
        //         $match: {
        //             createdAt: {
        //                 $gte: last12Months,
        //                 $lte: new Date()
        //             }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: { $month: "$createdAt" },
        //             total: { $sum: 1 }
        //         }
        //     }
        // ]);
        const result = {};
        // Sử dụng Promise.all để chờ cả hai Promise hoàn thành
        Promise.all([userHotelCountPromise, userTourCountPromise, userRoomsCountPromise])
            .then((results) => {
                const [hotelCount, tourCount, roomsCount] = results;
                const data = [
                    { name: "Tháng 1", Total: 1 },
                    { name: "Tháng 2", Total: 0 },
                    { name: "Tháng 3", Total: 2 },
                    { name: "Tháng 4", Total: 0 },
                    { name: "Tháng 5", Total: 4 },
                    { name: "Tháng 6", Total: 0 },
                    { name: "Tháng 7", Total: 0 },
                    { name: "Tháng 8", Total: 0 },
                    { name: "Tháng 9", Total: 0 },
                    { name: "Tháng 10", Total: 0 },
                    { name: "Tháng 11", Total: 8 },
                    { name: "Tháng 12", Total: 0 }
                ];

                // orderCount.forEach(item => {
                //     const month = item._id;
                //     const total = item.total;
                //     data[month - 1].Total = total;
                // });

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