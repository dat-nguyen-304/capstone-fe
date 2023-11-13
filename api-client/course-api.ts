import { CourseCardType } from '@/types';
import axiosClient from './axios-client';

export const courseApi = {
    getAll: async (page: number) => {
        const res = await axiosClient.get(`/courses?page=${page}&size=20&sortType=ASC`);
        return res.data;
    },
    getCourseById: async (courseId: number) => {
        const res = await axiosClient.get(`/courses/detail?id=${courseId}`);
    },
    getAllOfTeacher: async (email: string, page: number) => {
        const res = await axiosClient.get(`/courses/teacher?email=${email}&page=${page}&size=20&sortType=ASC`);
        return res.data;
    }
};
