import { ChangeVideoStatus } from '@/types';
import axiosClient from './axios-client';

export const videoApi = {
    getByCourseId: async (courseId: number, page: number, size: number) => {
        const res = await axiosClient.get(`/videos?courseId=${courseId}&page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    getVideoDetailById: async (videoId: number) => {
        const res = await axiosClient.get(`/videos/${videoId}`);
        return res.data;
    },
    getAllOfTeacher: async (email: string, commentStatus: string, page: number, size: number) => {
        const res = await axiosClient.get(
            `/videos/teacher?email=${email}&commonStatus=${commentStatus}&page=${page}&size=${size}&sortType=ASC`
        );
        return res.data;
    },
    getAllOfAdmin: async (commonStatus: string, page: number, size: number) => {
        const res = await axiosClient.get(
            `/videos/admin?commonStatus=${commonStatus}&page=${page}&size=${size}&sortType=ASC`
        );
        return res.data;
    },
    changeVideoStatus: async (payload: ChangeVideoStatus) => {
        return await axiosClient.post('/videos/admin/verify-video', payload);
    }
};
