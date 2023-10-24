import { TeacherRegisterPayload, StudentRegisterPayload, LoginPayload } from '@/types';
import axiosClient from './axios-client';

export const studentApi = {
    getStudent: async (email: string) => {
        return await axiosClient.get(`/student/${email}`);
    }
};
