import axiosClient from "./axiosClient";

const userApi = {
    login(username, password) {
        const url = '/auth/login';
        return axiosClient
            .post(url, {
                username,
                password,
            })
            .then(response => {
                console.log(response);
                if (response) {
                    localStorage.setItem("token", response.access_token);
                    localStorage.setItem("user", JSON.stringify(response.details));
                }
                return response;
            });
    },
    logout(data) {
        const url = '/users/logout';
        return axiosClient.get(url);
    },
    listUserByAdmin(data) {
        const url = '/users/search';
        if (!data.page || !data.limit) {
            data.limit = 10;
            data.page = 1;
        }
        return axiosClient.post(url, data);
    },
    banAccount(data, id) {
        const url = '/users/' + id;
        return axiosClient.put(url, data);
    },
    unBanAccount(data, id) {
        const url = '/users/' + id;
        return axiosClient.put(url, data);
    },
    getProfile(id) {
        const url = '/users/'+ id;
        return axiosClient.get(url);
    },
    searchUser(email) {
        console.log(email);
        const params = {
            email: email.target.value
        }
        const url = '/users/searchByEmail';
        return axiosClient.get(url, { params });
    },
}

export default userApi;