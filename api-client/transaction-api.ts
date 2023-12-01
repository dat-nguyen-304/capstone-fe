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
    getListStudentTransaction: async (page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/transaction/user?page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getListTeacherTransaction: async (page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/transaction/teacher?page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    studentRequestRefund: async (payload: any) => {
        return await axiosClient.post(`/transaction/student/request`, payload);
    }
};
