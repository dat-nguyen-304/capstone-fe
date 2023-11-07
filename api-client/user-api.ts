import { ChangePasswordPayload } from '@/types';
import axiosClient from './axios-client';

export const userApi = {
    changePassword: async (payload: ChangePasswordPayload) => {
        return await axiosClient.patch('/user/change-password', payload);
    }
};
