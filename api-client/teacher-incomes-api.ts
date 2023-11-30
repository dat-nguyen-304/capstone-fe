import axiosClient from './axios-client';
export const teacherIncomeApi = {
    getTeacherIncome: async () => {
        return await axiosClient.get(`/teacher-incomes`);
    },
    getTeacherRevenue: async () => {
        const res = await axiosClient.get(`/teacher-incomes/course-revenue`);
        return res?.data;
    },
    getTeacherIncomeByCourse: async (courseId: number) => {
        return await axiosClient.get(`/teacher-incomes/by-course?courseId=${courseId}`);
    }
};
