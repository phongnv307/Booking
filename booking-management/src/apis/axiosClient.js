import axios from 'axios';
import queryString from 'query-string';
import { createBrowserHistory } from "history";
import Cookies from 'js-cookie';

export const history = createBrowserHistory();

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json'
    },
    paramsSerializer: params => queryString.stringify(params),
});

Cookies.set('access_token', localStorage.getItem('token'), { expires: 7, path: '/' });

axiosClient.interceptors.request.use(async (config) => {
    const token = Cookies.get('access_token');
    config.headers.Authorization = `${localStorage.getItem('token')}`;
    return config;
});

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    if(error.response.data.message == "Signature has expired"){
        history.replace("/");
        localStorage.clear();
    }
    return error.response.data;
});

export default axiosClient; 
