import { ChangeVideoStatus, CreateComment } from '@/types';
import axiosClient from './axios-client';
import axiosFormData from './axios-form';
import { CreateDiscussion, UpdateDiscussion } from '@/types/discussion';

export const examApi = {
    getAllExamFilter: async (
        isAttempt: string,
        subject: string,
        examType: string,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const res = await axiosClient.get(
            `/examination/exams?${isAttempt !== '' ? `isAttempt=${isAttempt}` : ''}${
                subject !== '' && isAttempt !== ''
                    ? `&subject=${subject}`
                    : subject !== '' && isAttempt == ''
                    ? `subject=${subject}`
                    : ''
            }${
                isAttempt !== '' || subject !== '' ? `&examType=${examType}` : `examType=${examType}`
            }&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },

    getAllBySubject: async (subject: string, examType: string, page: number, size: number) => {
        const res = await axiosClient.get(
            `/examination/exams?subject=${subject}&examType=${examType}&page=${page}&size=${size}&sortType=ASC`
        );
        return res.data;
    },
    getAllByAdmin: async (page: number, size: number) => {
        const res = await axiosClient.get(`/examination/exams/admin?page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    getAllByAdminBySubject: async (subject: string, page: number, size: number) => {
        const res = await axiosClient.get(
            `/examination/exams/admin?subject=${subject}&page=${page}&size=${size}&sortType=ASC`
        );
        return res.data;
    },
    getExamById: async (examId: number) => {
        const res = await axiosClient.get(`/examination/exams/${examId}`);
        return res.data;
    },
    examinationTopics: async (page: number, size: number) => {
        const res = await axiosClient.get(`/examination/topics?page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    createExam: async (payload: any) => {
        return await axiosClient.post('/examination/exams', payload);
    },
    updateExam: async (examId: number, payload: any) => {
        return await axiosClient.put(`/examination/exams/${examId}`, payload);
    },
    deleteExam: async (examId: number) => {
        return await axiosClient.delete(`/examination/exams/${examId}`);
    },
    submitExam: async (examId: number, payload: any) => {
        return await axiosClient.put(`/examination/exams/submission/${examId}`, payload);
    },
    createAttempt: async (examId: number) => {
        return await axiosClient.post(`/examination/exams/submission/${examId}`);
    },
    getAllTopicBySubject: async (subject: string, page: number, size: number) => {
        if (subject == '') {
            const res = await axiosClient.get(`/examination/topics?page=${page}&size=${size}&sortType=ASC`);
            return res.data;
        } else {
            const res = await axiosClient.get(
                `/examination/topics?subject=${subject}&page=${page}&size=${size}&sortType=ASC`
            );
            return res.data;
        }
    },
    getAllTopicAdmin: async (page: number, size: number) => {
        const res = await axiosClient.get(`/examination/topics/admin?page=${page}&size=${size}&sortType=ASC`);
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
    },
    getExamSubmissionByExamId: async (examId: number, page: number, size: number) => {
        const res = await axiosClient.get(
            `/examination/exams/${examId}/submissions?page=${page}&size=${size}&sortType=DESC`
        );
        return res.data;
    },
    getExamSubmissionById: async (submissionId: number) => {
        const res = await axiosClient.get(`/examination/exams/submission/${submissionId}`);
        return res.data;
    }
};
