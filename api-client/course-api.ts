import { ChangeCourseStatus, CourseCardType, CreateCourse } from '@/types';
import axiosClient from './axios-client';
import axiosFormData from './axios-form';
export const courseApi = {
    getAll: async (page: number) => {
        const res = await axiosClient.get(`/courses/user?page=${page}&size=20&sortType=ASC`);
        return res.data;
    },
    getCourseById: async (courseId: number) => {
        const res = await axiosClient.get(`/courses/detail?id=${courseId}`);
        return res.data;
    },
    getAllOfTeacher: async (page: number, size: number) => {
        const res = await axiosClient.get(`/courses/teacher?page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    getAllOfTeacherDraft: async (page: number, size: number) => {
        const res = await axiosClient.get(`/courses/teacher/waiting-list?page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    getAllOfAdmin: async (commonStatus: string, page: number, size: number) => {
        const res = await axiosClient.get(
            `/courses/admin?commonStatus=${commonStatus}&page=${page}&size=${size}&sortType=ASC`
        );
        return res.data;
    },
    changeCourseStatus: async (payload: ChangeCourseStatus) => {
        return await axiosClient.post('/courses/admin/verify-course', payload);
    },
    createCourse: async (payload: any) => {
        return await axiosFormData.post('/courses/teacher/create', payload);
    },
    getCourseByIdForAdminAndTeacher: async (courseId: number) => {
        const res = await axiosClient.get(`/courses/detail/teacher?id=${courseId}`);
        return res.data;
    },
    updateCourse: async (payload: any) => {
        return await axiosFormData.put('/courses/teacher/update', payload);
    },
    getEnrollCourse: async (page: number) => {
        const res = await axiosClient.get(`/enroll-course?page=${page}&size=20&sortType=ASC`);
        return res.data;
    }
};
