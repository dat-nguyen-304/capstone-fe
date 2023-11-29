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
    },
    getSuggestCourseByCombination: async (subject1: number, subject2: number, subject3: number) => {
        let queryParams = '';

        if (subject1 !== 0) {
            queryParams += `subjectIds=${subject1}`;
        }

        if (subject2 !== 0) {
            queryParams += queryParams !== '' ? `&subjectIds=${subject2}` : `subjectIds=${subject2}`;
        }

        if (subject3 !== 0) {
            queryParams += queryParams !== '' ? `&subjectIds=${subject3}` : `subjectIds=${subject3}`;
        }

        const res = await axiosClient.get(`/suggest/combination?${queryParams}`);
        return res.data;
    }
};
