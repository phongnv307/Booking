import axiosClient from './axiosClient';

const productApi = {
    /*Danh sách api category */

    createCategory(data) {
        const url = '/category/search';
        return axiosClient.post(url, data);
    },
    getToursList(){
        const url = '/tours/';
        return axiosClient.get(url);
    },
    getToursListByCompany(){
        const url = '/tours/getTourByCompany';
        return axiosClient.get(url);
    },
    getDetailTour(id) {
        const url = '/tours/' + id;
        return axiosClient.get(url);
    },
    deleteTours(id) {
        const url = "/tours/" + id;
        return axiosClient.delete(url);
    },
    searchTour(name) {
        const params = {
            name: name.target.value
        }
        const url = '/tours/searchByNameCompany';
        return axiosClient.get(url, { params });
    },
    approvalTours(id, visible){
        const url = "/tours/" + id;
        return axiosClient.put(url, { visible });
    },
    searchTourByAdmin(name) {
        const params = {
            name: name.target.value
        }
        const url = '/tours/searchByNameAdmin';
        return axiosClient.get(url, { params });
    },
    searchHotelsByAdmin(name) {
        const params = {
            name: name.target.value
        }
        const url = '/hotels/searchByNameAdmin';
        return axiosClient.get(url, { params });
    },
    getDetailCategory(id) {
        const url = '/category/' + id;
        return axiosClient.get(url);
    },
    getListCategory(data) {
        const url = '/category/search';
        if(!data.page || !data.limit){
            data.limit = 10;
            data.page = 1;
        }
        return axiosClient.post(url,data);
    },
    deleteCategory(id) {
        const url = "/category/" + id;
        return axiosClient.delete(url);
    },
    searchCategory(name) {
        const params = {
            name: name.target.value
        }
        const url = '/category/searchByName';
        return axiosClient.get(url, { params });
    },

    /*Danh sách api hotels */

    createProduct(data) {
        const url = '/product/search';
        return axiosClient.post(url, data);
    },
    getDetailHotels(id) {
        const url = '/hotels/find/' + id;
        return axiosClient.get(url);
    },
    getListHotels(data) {
        const url = '/hotels/';
        return axiosClient.get(url);
    },
    getListHotelsByCompany(data) {
        const url = '/hotels/getHotelByCompany';
        return axiosClient.get(url);
    },
    searchHotels(name) {
        const params = {
            name: name.target.value
        }
        const url = '/hotels/searchByNameCompany';
        return axiosClient.get(url, { params });
    },
    searchTourByHotels(name) {
        const params = {
            name: name.target.value
        }
        const url = '/hotels/searchByNameAdmin';
        return axiosClient.get(url, { params });
    },
    deleteProduct(id) {
        const url = "/hotels/" + id;
        return axiosClient.delete(url);
    },
    uploadImage() {
        const url = "/upload/uploadfile";
        return axiosClient.post(url);
    },
    searchProduct(name) {
        const params = {
            name: name.target.value
        }
        const url = '/hotels/searchByName';
        return axiosClient.get(url, { params });
    },
    approvalHotel(id, visible){
        const url = "/hotels/" + id;
        return axiosClient.put(url, { visible });
    },

    /* Danh sách api rooms */
    getListRooms() {
        const url = '/rooms';
        return axiosClient.get(url);
    },
    getListRoomsByCompany() {
        const url = '/rooms/getRoomsByAllCompany';
        return axiosClient.get(url);
    },
    getRoomsByAllCompany() {
        const url = '/rooms/getRoomsByAllCompany';
        return axiosClient.get(url);
    },
    searchRooms(name) {
        const params = {
            name: name.target.value
        }
        const url = '/rooms/searchByNameCompany';
        return axiosClient.get(url, { params });
    },
    searchRoomsByAdmin(name) {
        const params = {
            name: name.target.value
        }
        const url = '/rooms/searchByNameAdmin';
        return axiosClient.get(url, { params });
    },
    getDetailRooms(id) {
        const url = '/rooms/' + id;
        return axiosClient.get(url);
    },
    deleteRooms(id) {
        const url = "/rooms/" + id;
        return axiosClient.delete(url);
    },
    approvalRooms(id, visible){
        const url = "/rooms/" + id;
        return axiosClient.put(url, { visible });
    },
}

export default productApi;