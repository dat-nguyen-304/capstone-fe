import { TeacherRegisterPayload, StudentRegisterPayload, LoginPayload } from '@/types';
import axiosClient from './axios-client';

export const authApi = {
    studentRegister: async (payload: StudentRegisterPayload) => {
        return await axiosClient.post('/authentication/register/student', payload);
    },

    teacherRegister: async (payload: TeacherRegisterPayload) => {
        return await axiosClient.post('/authentication/register/teacher', payload);
    },

    confirmRegister: async (id: string) => {
        return await axiosClient.get(`/authentication/confirm?token=${id}`);
    },

    login: async (payload: LoginPayload) => {
        return axiosClient.post('/authentication/login', payload);
    }
};
