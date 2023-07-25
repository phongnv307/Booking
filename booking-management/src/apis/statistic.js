import axiosClient from './axiosClient';

const statisticApi = {
    /*Danh sách api sự kiện */
    getTotal() {
        const url = '/statistical/count';
        return axiosClient.get(url);
    },

    getTotalByCompany(){
        const url = '/statistical/countByCompany';
        return axiosClient.get(url);
    }
}

export default statisticApi;