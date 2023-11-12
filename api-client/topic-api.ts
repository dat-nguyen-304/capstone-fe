import { Topic } from '@/types';
import axiosClient from './axios-client';
export const topicApi = {
    getTopicsBySubject: async (subjectId: number) => {
        const {
            data: { data: topics }
        } = await axiosClient.get(`/topics/${subjectId}/?page=0&size=40&sortType=ASC`);
        return topics as Topic[];
    }
};
