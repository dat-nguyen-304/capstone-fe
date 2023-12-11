import { Teacher } from '@/types';
import axiosClient from './axios-client';
import axiosFormData from './axios-form';

export const teacherApi = {
    getAll: async (page: number, size: number, status: String) => {
        const { data: teachers } = await axiosClient.get(
            `/teacher?page=${page}&size=${size}&sortType=ASC&userStatus=${status}`
        );
        return teachers;
    },
    getPublicTeacher: async (email: string) => {
        return await axiosClient.get(`/teacher/detail/user?email=${email}`);
    },
    getTeacherDetail: async () => {
        const res = await axiosClient.get(`/teacher/detail`);
        return res?.data;
    },
    sendVerifyTeacher: async (payload: any) => {
        return await axiosFormData.put(`/teacher/edit-information`, payload);
    },
    verifyTeacherByAdmin: async (payload: any) => {
        return await axiosClient.patch(`/teacher/verify-information`, payload);
    },
    getTeachersVerificationList: async (page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/teacher/admin/verification-list?page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res?.data;
    },
    getTeacherVerifyDetail: async (teacherVerifyId: number) => {
        const res = await axiosClient.get(`/teacher/admin/detail?page=0&id=${teacherVerifyId}`);
        return res?.data;
    }
};
