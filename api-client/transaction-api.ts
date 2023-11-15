import { Transaction } from '@/types';
import axiosClient from './axios-client';

export const transactionApi = {
    createPayment: async (payload: Transaction) => {
        const res = await axiosClient.post(`/transaction`, payload);
        return res.data;
    }
};
