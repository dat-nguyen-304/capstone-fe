import { ChangeVideoStatus, CreateComment, CreateTopicObject } from '@/types';
import axiosClient from './axios-client';
import axiosFormData from './axios-form';
import { CreateDiscussion, UpdateDiscussion } from '@/types/discussion';

export const discussionApi = {
    getAll: async (page: number, size: number) => {
        const res = await axiosClient.get(`/discussion/topics?page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    createTopic: async (payload: CreateTopicObject) => {
        return await axiosClient.post('/discussion/topics', payload);
    },
    getAllOfConversation: async (page: number, size: number) => {
        const res = await axiosClient.get(`/discussion/conversations?&page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    createDiscussion: async (payload: any) => {
        return await axiosFormData.post('/discussion/conversations', payload);
    },
    getDiscussionById: async (discussionId: number) => {
        const res = await axiosClient.get(`/discussion/conversations/${discussionId}`);
        return res.data;
    },
    createComment: async (payload: any, discussionId: number) => {
        return await axiosFormData.post(`/discussion/comments/${discussionId}`, payload);
    },
    getCommentsByDiscussionId: async (discussionId: number) => {
        const res = await axiosClient.get(`/discussion/conversations/${discussionId}/comments`);
        return res.data;
    },
    updateDiscussion: async (payload: UpdateDiscussion, conversationId: number) => {
        return await axiosClient.put(`/discussion/conversations/${conversationId}`, payload);
    },
    getAllMyDiscussion: async (page: number, size: number) => {
        const res = await axiosClient.get(`/discussion/conversations/my?page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    discussionReact: async (discussionId: number) => {
        return await axiosClient.post(`/discussion/conversation/react/${discussionId}`);
    },
    createConversationReport: async (payload: any, discussionId: number) => {
        return await axiosFormData.post(`/discussion/report/conversations/${discussionId}`, payload);
    }
};
