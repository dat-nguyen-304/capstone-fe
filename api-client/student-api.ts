import { TeacherRegisterPayload, StudentRegisterPayload, LoginPayload, Student } from '@/types';
import axiosClient from './axios-client';

export const studentApi = {
    getStudent: async (email: string) => {
        return await axiosClient.get(`/student/${email}`);
    },
    getAll: async (page: number, size: number, status: String) => {
        const { data: students } = await axiosClient.get(
            `/student?page=${page}&size=${size}&sortType=ASC&userStatus=${status}`
        );
        return students;
    }
};
