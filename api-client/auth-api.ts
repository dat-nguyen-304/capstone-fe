import { TeacherRegisterPayload, LoginPayload } from '@/types';
import axiosClient from './axios-client';

export const authApi = {
    studentRegister(payload: TeacherRegisterPayload) {
        return axiosClient.post('/authentication/register/student', payload);
    },

    teacherRegister(payload: TeacherRegisterPayload) {
        return axiosClient.post('/authentication/register/teacher', payload);
    },

    login(payload: LoginPayload) {
        return axiosClient.post('/authentication/login', payload);
    }
};
