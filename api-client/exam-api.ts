import { ChangeVideoStatus, CreateComment } from '@/types';
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
    },
    updateExam: async (examId: number, payload: any) => {
        return await axiosClient.put(`/examination/exams/${examId}`, payload);
    },
    submitExam: async (examId: number, payload: any) => {
        return await axiosClient.put(`/examination/exams/submission/${examId}`, payload);
    },
    createAttempt: async (examId: number) => {
        return await axiosClient.post(`/examination/exams/submission/${examId}`);
    },
    getAllTopic: async (page: number, size: number) => {
        const res = await axiosClient.get(`/examination/topics?page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    getTopicExamById: async (topicId: number) => {
        const res = await axiosClient.get(`/examination/topics/${topicId}`);
        return res.data;
    },
    createTopicExam: async (payload: any) => {
        return await axiosClient.post('/examination/topics', payload);
    },
    updateTopicExam: async (payload: any, topicId: number) => {
        return await axiosClient.put(`/examination/topics/${topicId}`, payload);
    },
    deleteTopicExam: async (topicId: number) => {
        return await axiosClient.delete(`/examination/topics/${topicId}`);
    }
};
