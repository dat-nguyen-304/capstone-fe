import axiosClient from './axios-client';

export const dashboardApi = {
    getAll: async () => {
        const res = await axiosClient.get('/dashboard');
        return res?.data;
    }
};
