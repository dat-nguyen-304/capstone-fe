import axiosClient from './axios-client';
export const commentsVideoApi = {
    createCommentVideo: async (payload: any) => {
        return await axiosClient.post(`/comments`, payload);
    },
    getCommentsVideoById: async (videoId: number, page: number, size: number) => {
        const res = await axiosClient.get(`/comments?videoId=${videoId}&page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    }
};
