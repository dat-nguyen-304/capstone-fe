import axiosClient from './axios-client';

export const teacherApi = {
    getAll: async () => {
        const res = await axiosClient.get(`/teacher`);
        return res.data;
    }
};
