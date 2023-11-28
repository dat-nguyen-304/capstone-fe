import { Subject } from '@/types';
import axiosClient from './axios-client';

export const suggestApi = {
    getSuggestBySubject: async (subjectId: number) => {
        const res = await axiosClient.get(`/suggest/subject?subjectId=1${subjectId}`);
        return res.data;
    },
    getSuggestByCombination: async (subject1: number, subject2: number, subject3: number) => {
        const res = await axiosClient.get(
            `/suggest/combination?subjectIds=${subject1}&subjectIds=${subject2}&subjectIds=${subject3}`
        );
        return res.data;
    }
};
