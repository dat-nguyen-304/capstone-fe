import { CourseCardType } from '@/types';
import axiosClient from './axios-client';

export const courseApi = {
    getAll: async (page: number) => {
        const res = await axiosClient.get(`/courses?page=${page}&size=20&sortType=ASC`);
        return res.data;
    },
    getCourseById: async (courseId: number) => {
        const res = await axiosClient.get(`/courses/detail?id=${courseId}`);
        return res.data;
    }
};
