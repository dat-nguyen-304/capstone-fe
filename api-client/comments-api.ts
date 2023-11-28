import axiosClient from './axios-client';
export const commentsVideoApi = {
    createCommentVideo: async (payload: any) => {
        return await axiosClient.post(`/comments`, payload);
    },
    getCommentsVideoById: async (videoId: number, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/comments?videoId=${videoId}&page=${page}&size=${size}&field=${field}&sortType=ASC`
        );
        return res.data;
    }
};
