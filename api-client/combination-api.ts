import { Combination } from '@/types';
import axiosClient from './axios-client';

export const combinationApi = {
    getAll: async () => {
        const {
            data: { data: combinations }
        } = await axiosClient.get('/combinations');
        return combinations as Combination[];
    }
};
