import { ChangePasswordPayload, ChangeUserStatus } from '@/types';
import axiosClient from './axios-client';
import axiosFormData from './axios-form';

export const userApi = {
    changePassword: async (payload: ChangePasswordPayload) => {
        return await axiosClient.patch('/user/change-password', payload);
    },
    changeUserStatus: async (payload: ChangeUserStatus) => {
        return await axiosClient.patch('/user/change-user-status', payload);
    },
    banUser: async (payload: any) => {
        return await axiosClient.patch('/user/ban-user', payload);
    },
    edit: async (payload: any) => {
        return await axiosFormData.put('/user/edit-information', payload);
    }
};
