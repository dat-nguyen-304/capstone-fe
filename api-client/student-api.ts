import axiosClient from './axios-client';

export const studentApi = {
    getStudent: async () => {
        return await axiosClient.get(`/student/detail`);
    },
    getPublicStudent: async (email: string) => {
        return await axiosClient.get(`/student/public/detail/${email}`);
    },
    getAll: async (page: number, size: number, status: string) => {
        const { data: students } = await axiosClient.get(
            `/student?page=${page}&size=${size}&sortType=ASC&userStatus=${status}`
        );
        return students;
    },
    addTarget: async (newTarget: any) => {
        return await axiosClient.post('/student/target', newTarget);
    },
    getTarget: async () => {
        const { data: students } = await axiosClient.get(`student/targets`);
        return students;
    },
    updateTarget: async (newTarget: any) => {
        return await axiosClient.post('/student/edit-target', newTarget);
    }
};
