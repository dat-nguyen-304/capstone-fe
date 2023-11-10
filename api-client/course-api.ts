import { CourseCardType } from '@/types';
import axiosClient from './axios-client';

export const courseApi = {
    getCourses: async (page: number) => {
        const res = await axiosClient.get(`/courses?page=${page}&size=20&sortType=ASC`);
        return res.data;
    }
};
