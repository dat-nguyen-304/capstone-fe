import { Teacher } from '@/types';
import axiosClient from './axios-client';

export const teacherApi = {
    getAll: async (page: number, size: number, status: String) => {
        const { data: teachers } = await axiosClient.get(
            `/teacher?page=${page}&size=${size}&sortType=ASC&userStatus=${status}`
        );
        return teachers;
    },
    getPublicTeacher: async (email: string) => {
        return await axiosClient.get(`/teacher/detail/user?email=${email}`);
    }
};
