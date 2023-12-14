import { Transaction } from '@/types';
import axiosClient from './axios-client';

export const transactionApi = {
    createPayment: async (payload: Transaction) => {
        const res = await axiosClient.post(`/transaction`, payload);
        return res.data;
    },
    getListAdminTransaction: async (status: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/transaction/admin${status !== '' ? `?status=${status}` : ''}${
                status !== '' ? `&page=${page}` : `?page=${page}`
            }&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getListStudentTransaction: async (status: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/transaction/user?status=${status}&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getListTeacherTransaction: async (status: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/transaction/teacher?status=${status}&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    studentRequestRefund: async (payload: any) => {
        return await axiosClient.post(`/transaction/student/request`, payload);
    },
    adminRefund: async (payload: any) => {
        return await axiosClient.post(`/transaction/admin/refund`, payload);
    }
};
