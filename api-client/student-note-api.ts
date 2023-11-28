import axiosClient from './axios-client';
import axiosFormData from './axios-form';
export const studentNoteApi = {
    getVideoNote: async (videoId: number) => {
        const res = await axiosClient.get(`/student-notes?videoId=${videoId}`);
        return res.data;
    },
    createVideoNote: async (payload: any) => {
        return await axiosClient.post(`/student-notes`, payload);
    },
    editVideoNote: async (payload: any) => {
        return await axiosClient.put('/student-notes', payload);
    },
    deleteVideoNote: async (noteId: any) => {
        return await axiosClient.delete(`/student-notes?id=${noteId}`);
    }
};
