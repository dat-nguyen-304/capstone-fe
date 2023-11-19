import { ChangeVideoStatus, CreateComment, CreateTopic } from '@/types';
import axiosClient from './axios-client';
import axiosFormData from './axios-form';
import { CreateDiscussion, UpdateDiscussion } from '@/types/discussion';

export const examApi = {
    getAll: async (subject: string, page: number, size: number) => {
        const res = await axiosClient.get(
            `/examination/exams?subject=${subject}&page=${page}&size=${size}&sortType=ASC`
        );
        return res.data;
    },
    getExamById: async (examId: number) => {
        const res = await axiosClient.get(`/examination/exams/${examId}`);
        return res.data;
    },
    examinationTopics: async (page: number, size: number) => {
        const res = await axiosClient.get(`/examination/topics?&page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    createExam: async (payload: any) => {
        return await axiosClient.post('/examination/exams', payload);
    }
};
