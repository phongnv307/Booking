import axiosClient from './axiosClient';

const orderApi = {
    /*Danh sách api category */

    createOrder(data) {
        const url = '/order/search';
        return axiosClient.post(url, data);
    },
    getDetailOrder(id) {
        const url = '/order/' + id;
        return axiosClient.get(url);
    },
    getDetailsBookingRoom(id){
        const url = '/rooms/getBookingById/' + id + '?bookingRoomId=' + id;
        return axiosClient.get(url);
    },
    getDetailsBookingTour(id){
        const url = '/tours/getBookingById/' + id + '?bookingRoomId=' + id;
        return axiosClient.get(url);
    },
    getListBookTour() {
        const url = '/tours/bookedByAdmin';
        return axiosClient.get(url);
    },
    getListBookTourByCompany() {
        const url = '/tours/bookByCompany';
        return axiosClient.get(url);
    },
    getListBookRooms() {
        const url = '/rooms/bookedByAdmin';
        return axiosClient.get(url);
    },
    getListBookRoomsByCompany() {
        const url = '/rooms/bookByCompany';
        return axiosClient.get(url);
    },
    deleteOrder(id) {
        const url = "/order/" + id;
        return axiosClient.delete(url);
    },
    searchOrder(name) {
        const params = {
            name: name.target.value
        }
        const url = '/order/searchByName';
        return axiosClient.get(url, { params });
    },

    
}

export default orderApi;