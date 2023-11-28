import { ChangeVideoStatus, CreateComment, CreateTopicObject } from '@/types';
import axiosClient from './axios-client';
import axiosFormData from './axios-form';
import { CreateDiscussion, UpdateDiscussion } from '@/types/discussion';

export const discussionApi = {
    getAll: async (page: number, size: number) => {
        const res = await axiosClient.get(`/discussion/topics?page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    getTopicById: async (topicId: number) => {
        const res = await axiosClient.get(`/discussion/topics/${topicId}`);
        return res.data;
    },
    createTopic: async (payload: CreateTopicObject) => {
        return await axiosClient.post('/discussion/topics', payload);
    },
    updateTopic: async (payload: CreateTopicObject, topicId: number) => {
        return await axiosClient.put(`/discussion/topics/${topicId}`, payload);
    },
    deleteTopic: async (topicId: number) => {
        return await axiosClient.delete(`/discussion/topics/${topicId}`);
    },
    getAllOfConversation: async (page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/discussion/conversations?&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getConversationsByTopicId: async (topicId: number, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/discussion/topics/${topicId}/conversations?&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    createDiscussion: async (payload: any) => {
        return await axiosFormData.post('/discussion/conversations', payload);
    },
    deleteDiscussion: async (discussionId: number) => {
        return await axiosClient.delete(`/discussion/conversations/${discussionId}`);
    },
    getDiscussionById: async (discussionId: number) => {
        const res = await axiosClient.get(`/discussion/conversations/${discussionId}`);
        return res.data;
    },
    createComment: async (payload: any, discussionId: number) => {
        return await axiosFormData.post(`/discussion/comments/${discussionId}`, payload);
    },
    getCommentsByDiscussionId: async (
        discussionId: number,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const res = await axiosClient.get(
            `/discussion/conversations/${discussionId}/comments?page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    updateDiscussion: async (payload: UpdateDiscussion, conversationId: number) => {
        return await axiosClient.put(`/discussion/conversations/${conversationId}`, payload);
    },
    getAllMyDiscussion: async (page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/discussion/conversations/my?page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    discussionReact: async (discussionId: number) => {
        return await axiosClient.post(`/discussion/conversation/react/${discussionId}`);
    },
    createConversationReport: async (payload: any, discussionId: number) => {
        return await axiosFormData.post(`/discussion/report/conversations/${discussionId}`, payload);
    },
    commentReact: async (commentId: number) => {
        return await axiosClient.put(`/discussion/comments/react/${commentId}`);
    },
    createCommentReport: async (payload: any, commentId: number) => {
        return await axiosFormData.post(`/discussion/report/comments/${commentId}`, payload);
    },
    getListReportConversation: async (reportType: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/discussion/report/conversations?${reportType !== '' ? `reportType=${reportType}` : ''}${
                reportType !== '' ? `&page=${page}` : `page=${page}`
            }&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    }
};
