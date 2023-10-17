import { Subject } from '@/types';
import axiosClient from './axios-client';

export const subjectApi = {
    getAll: async () => {
        const {
            data: { data: subjects }
        } = await axiosClient.get('/subjects');
        return subjects as Subject[];
    }
};
