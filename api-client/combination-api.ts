import axiosClient from './axios-client';

export const combinationApi = {
    getAll() {
        return axiosClient.get('/combinations');
    }
};
