import axiosClient from './axios-client';
export const reactVideoApi = {
    reactVideo: async (payload: any) => {
        return await axiosClient.post(`/react`, payload);
    }
};
