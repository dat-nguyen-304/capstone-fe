import { TeacherRegisterPayload, StudentRegisterPayload, LoginPayload, ResetPasswordPayload } from '@/types';
import axiosClient from './axios-client';

export const authApi = {
    studentRegister: async (payload: StudentRegisterPayload) => {
        return await axiosClient.post('/authentication/register/student', payload);
    },

    teacherRegister: async (payload: TeacherRegisterPayload) => {
        return await axiosClient.post('/authentication/register/teacher', payload);
    },

    confirm: async (id: string) => {
        return await axiosClient.patch('/authentication/confirm', { token: id });
    },

    login: async (payload: LoginPayload) => {
        return await axiosClient.post('/authentication/login', payload);
    },

    loginWithGoogle: async (token: string) => {
        return await axiosClient.post('/authentication/login/google', { token });
    },

    logout: async (payload: { email: string }) => {
        return await axiosClient.post('/authentication/logout', payload);
    },

    refreshToken: async () => {
        return await axiosClient.post('/authentication/refresh-token');
    },

    forgotPassword: async (email: string) => {
        return await axiosClient.patch('/authentication/forgot-password', { email });
    },

    resetPassword: async (payload: ResetPasswordPayload) => {
        return await axiosClient.patch('/authentication/reset-password', payload);
    },

    activeAccount: async (id: string) => {
        return await axiosClient.patch('/authentication/active-account', { token: id });
    }
};
