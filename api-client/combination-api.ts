import { Combination } from '@/types';
import axiosClient from './axios-client';

export const combinationApi = {
    getAll: async () => {
        const { data } = await axiosClient.get('/combinations');
        return data as Combination[];
    }
};
