import { ChangeVideoStatus, CreateComment } from '@/types';
import axiosClient from './axios-client';
import axiosFormData from './axios-form';
import { CreateDiscussion, UpdateDiscussion } from '@/types/discussion';

export const examApi = {
    getAllExamFilter: async (
        pattern: string,
        isAttempt: string,
        subject: string,
        examType: string,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const res = await axiosClient.get(
            `/examination/exams?${pattern !== '' ? `pattern=${pattern}` : ''}${
                isAttempt !== '' && pattern !== ''
                    ? `&isAttempt=${isAttempt}`
                    : isAttempt !== '' && pattern == ''
                    ? `isAttempt=${isAttempt}`
                    : ''
            }${
                subject !== '' && (isAttempt !== '' || pattern !== '')
                    ? `&subject=${subject}`
                    : subject !== '' && isAttempt == '' && pattern == ''
                    ? `subject=${subject}`
                    : ''
            }${
                pattern !== '' || isAttempt !== '' || subject !== '' ? `&examType=${examType}` : `examType=${examType}`
            }&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getQuizByOwnerId: async (
        subject: string,
        examType: string,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const res = await axiosClient.get(
            `/examination/exams/my${subject !== '' ? `?subject=${subject}` : ''}${
                subject !== '' ? `&examType=${examType}` : subject == '' ? `?examType=${examType}` : ''
            }&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getExamBySearch: async (page: number, size: number) => {
        const res = await axiosClient.get(`/examination/exams/admin?page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    getAllBySubject: async (subject: string, examType: string, page: number, size: number) => {
        const res = await axiosClient.get(
            `/examination/exams?subject=${subject}&examType=${examType}&page=${page}&size=${size}&sortType=ASC`
        );
        return res.data;
    },
    getAllByAdmin: async (
        subject: string,
        examType: string,
        status: string,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const res = await axiosClient.get(
            `/examination/exams/admin?${subject !== '' ? `subject=${subject}` : ''}${
                subject !== '' && examType !== ''
                    ? `&examType=${examType}`
                    : subject == '' && examType !== ''
                    ? `examType=${examType}`
                    : ``
            }${
                (subject !== '' || examType !== '') && status !== ''
                    ? `&status=${status}`
                    : subject == '' && examType == '' && status !== ''
                    ? `status=${status}`
                    : ``
            }${
                subject !== '' || examType !== '' || status !== '' ? `&page=${page}` : `page=${page}`
            }&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getAllByAdminUpdate: async (
        pattern: string,
        subject: string,
        examTypeList: any[],
        status: string,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const examTypeString =
            examTypeList.length && (pattern !== '' || subject !== '')
                ? `&examTypeList=${examTypeList.join('&examTypeList=')}`
                : examTypeList.length && pattern == '' && subject == ''
                ? `examTypeList=${examTypeList.join('&examTypeList=')}`
                : '';
        const res = await axiosClient.get(
            `/examination/exams/admin?${pattern !== '' ? `pattern=${pattern}` : ''}${
                pattern !== '' && subject !== ''
                    ? `&subject=${subject}`
                    : pattern == '' && subject !== ''
                    ? `subject=${subject}`
                    : ''
            }${examTypeString}${
                (pattern !== '' || subject !== '' || examTypeList?.length) && status !== ''
                    ? `&statusList=${status}`
                    : subject == '' && !examTypeList?.length && status !== ''
                    ? `statusList=${status}`
                    : ``
            }${
                pattern !== '' || subject !== '' || examTypeList?.length || status !== ''
                    ? `&page=${page}`
                    : `page=${page}`
            }&size=${size}&field=${field}&sortType=${sort}`
        );
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
    getAllTopicAdmin: async (subject: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/examination/topics/admin?${
                subject !== '' ? `subject=${subject}&page=${page}` : `page=${page}`
            }&size=${size}&field=${field}&sortType=${sort}`
        );
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
    },
    getExamSubmissionStatistic: async (subject: string) => {
        const res = await axiosClient.get(
            `/examination/exams/submission/statistic${subject != '' ? `?subject=${subject}` : ''}`
        );
        return res.data;
    },
    getExamSubmissions: async (
        pattern: string,
        subject: string,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const res = await axiosClient.get(
            `/examination/exams/submission?${pattern !== '' ? `pattern=${pattern}` : ''}${
                pattern !== '' && subject != '' ? `&subject=${subject}` : subject != '' ? `subject=${subject}` : ''
            }${
                pattern != '' || subject !== '' ? `&page=${page}` : `page=${page}`
            }&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getExamSubmissionStatisticBySubject: async (
        subject: string,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const res = await axiosClient.get(
            `/examination/statistic?subject=${subject}&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getSubmissionStatisticBySubId: async (submissionId: number) => {
        const res = await axiosClient.get(`/examination/exams/submission/${submissionId}/statistic`);
        return res.data;
    },
    createExamReport: async (payload: any, examId: number) => {
        return await axiosFormData.post(`/examination/report/${examId}`, payload);
    },
    responseExamReport: async (response: any, reportId: number) => {
        return await axiosClient.put(`/examination/report/${reportId}`, response);
    },
    getListReportExam: async (reportType: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/examination/report?${reportType !== '' ? `type=${reportType}` : ''}${
                reportType !== '' ? `&page=${page}` : `page=${page}`
            }&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getExamRandomBySubject: async (subject: string) => {
        const res = await axiosClient.get(`/examination/exams/random?subject=${subject}`);
        return res.data;
    },
    getEntranceExamBySubject: async (subject: string) => {
        const res = await axiosClient.get(`/examination/exams/entrance?subject=${subject}`);
        return res.data;
    },
    getEntranceExamByCombination: async (subject1: string, subject2: string, subject3: string) => {
        const res = await axiosClient.get(
            `/examination/exams/entrances?subject1=${subject1}&subject2=${subject2}&subject3=${subject3}`
        );
        return res.data;
    },
    getQuizCourseById: async (courseId: number) => {
        const res = await axiosClient.get(`/examination/exams/course/${courseId}`);
        return res.data;
    },
    updateQuizDraftToQuiz: async (courseId: number, courseDraftId: number) => {
        const res = await axiosClient.put(
            `/examination/exams/course?courseId=${courseId}&courseDraftId=${courseDraftId}`
        );
        return res.data;
    },
    sortQuiz: async (payload: any) => {
        return await axiosClient.put(`/examination/exams/course/order`, payload);
    },
    updateStatusExam: async (examId: number, status: string) => {
        return await axiosClient.put(`/examination/exams/status/${examId}?status=${status}`);
    }
};
