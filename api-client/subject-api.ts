import axiosClient from './axios-client';

export const subjectApi = {
    getAll() {
        return axiosClient.get('/subjects');
    }
};
