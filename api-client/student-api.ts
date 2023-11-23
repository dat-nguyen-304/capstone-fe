import axiosClient from './axios-client';

export const studentApi = {
    getStudent: async () => {
        return await axiosClient.get(`/student/detail`);
    },
    getAll: async (page: number, size: number, status: string) => {
        const { data: students } = await axiosClient.get(
            `/student?page=${page}&size=${size}&sortType=ASC&userStatus=${status}`
        );
        return students;
    },
    addTarget: async (newTarget: any) => {
        await axiosClient.post('/student/target', newTarget);
    },
    updateTarget: async (newTarget: any) => {
        await axiosClient.post('/student/edit-target', newTarget);
    }
};
