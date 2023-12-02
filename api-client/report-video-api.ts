import axiosClient from './axios-client';
import axiosFormData from './axios-form';
export const reportVideoApi = {
    reportsVideo: async (page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(`/reports?page=${page}&size=${size}&field=${field}&sortType=${sort}`);
        return res.data;
    },
    reportsVideoByType: async (status: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/reports/by-type?status=${status}&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    createVideoReport: async (payload: any) => {
        return await axiosFormData.post(`/reports`, payload);
    },
    verifyReportContent: async (payload: any) => {
        return await axiosClient.patch('/reports', payload);
    }
};
