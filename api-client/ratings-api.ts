import axiosClient from './axios-client';
export const ratingCourseApi = {
    createRating: async (payload: any) => {
        return await axiosClient.post(`/ratings`, payload);
    },
    getRatingCourseById: async (courseId: number, page: number, size: number) => {
        const res = await axiosClient.get(`/ratings?courseId=${courseId}&page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    }
};
