import { ChangeVideoStatus } from '@/types';
import axiosClient from './axios-client';
import axiosFormData from './axios-form';

export const videoApi = {
    getByCourseId: async (courseId: number, page: number, size: number) => {
        const res = await axiosClient.get(`/videos?courseId=${courseId}&page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    getVideoDetailById: async (videoId: number) => {
        const res = await axiosClient.get(`/videos/user/${videoId}`);
        return res.data;
    },
    getAllOfTeacher: async (commentStatus: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/videos/teacher?commonStatus=${commentStatus}&page=${page}&field=${field}&size=${size}&sortType=${sort}`
        );
        return res.data;
    },
    getAllOfTeacherDraft: async (page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/videos/teacher/draft-list?page=${page}&size=${size}&field=${field}&sortType=${sort}`
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
    },
    createVideo: async (payload: any) => {
        return await axiosFormData.put('/videos/teacher/updload', payload);
    },
    createVideoForNewCourse: async (payload: any) => {
        return await axiosFormData.post('/videos', payload);
    },
    getVideoDetailByIdForAdminAndTeacher: async (videoId: number) => {
        const res = await axiosClient.get(`/videos/teacher/${videoId}`);
        return res.data;
    },
    updateVideoDraft: async (payload: any) => {
        return await axiosFormData.put('/videos/update', payload);
    },
    getVideoForPublicProfile: async (email: string, page: number, size: number) => {
        const res = await axiosClient.get(`/videos/user?email=${email}&page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    updateVideo: async (payload: any) => {
        return await axiosClient.put('/videos/teacher/update-content', payload);
    },
    getVideoDraftById: async (videoDraftId: number) => {
        const res = await axiosClient.get(`/videos/teacher/temporary/${videoDraftId}`);
        return res.data;
    }
};
