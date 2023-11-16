import { ChangeVideoStatus, CreateTopic } from '@/types';
import axiosClient from './axios-client';
import axiosFormData from './axios-form';

export const discussionApi = {
    getAll: async (page: number, size: number) => {
        const res = await axiosClient.get(`/discussion/topics?page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    getByTopicId: async (courseId: number, page: number, size: number) => {
        const res = await axiosClient.get(`/videos?courseId=${courseId}&page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    createTopic: async (payload: CreateTopic) => {
        return await axiosClient.post('/discussion/topics', payload);
    },
    getVideoDetailById: async (videoId: number) => {
        const res = await axiosClient.get(`/videos/${videoId}`);
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
    },
    getVideoDetailByIdForAdminAndTeacher: async (videoId: number) => {
        const res = await axiosClient.get(`/videos/teacher/${videoId}`);
        return res.data;
    },
    updateVideo: async (payload: any) => {
        return await axiosFormData.put('/videos/update', payload);
    }
};
