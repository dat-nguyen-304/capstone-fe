import axiosClient from './axios-client';
export const progressVideoApi = {
    progressApi: async (videoId: number) => {
        return await axiosClient.post(`/student-progress/${videoId}`);
    }
};
