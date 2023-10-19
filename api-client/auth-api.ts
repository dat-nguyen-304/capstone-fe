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
        return await axiosClient.get(`/authentication/confirm?token=${id}&from=register`);
    },

    login: async (payload: LoginPayload) => {
        return await axiosClient.post('/authentication/login', payload);
    },

    logout: async () => {
        return await axiosClient.post('/logout');
    }
};
