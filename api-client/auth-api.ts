import { TeacherRegisterPayload, StudentRegisterPayload, LoginPayload } from '@/types';
import axiosClient from './axios-client';

export const authApi = {
    studentRegister: async (payload: StudentRegisterPayload) => {
        return await axiosClient.post('/authentication/register/student', payload);
    },

    teacherRegister: async (payload: TeacherRegisterPayload) => {
        return await axiosClient.post('/authentication/register/teacher', payload);
    },

    confirm: async (id: string) => {
        return await axiosClient.post('/authentication/confirm', { token: id });
    },

    login: async (payload: LoginPayload) => {
        return await axiosClient.post('/authentication/login', payload);
    },

    logout: async (payload: { email: string }) => {
        return await axiosClient.post('/authentication/logout', payload);
    },

    refreshToken: async () => {
        return await axiosClient.post('/authentication/refresh-token');
    },

    forgotPassword: async (email: string) => {
        return await axiosClient.patch('/authentication/forgot-password', { email });
    }
};
