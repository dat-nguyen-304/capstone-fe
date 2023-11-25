import axiosClient from './axios-client';
export const teacherIncomeApi = {
    getTeacherIncome: async () => {
        return await axiosClient.get(`/teacher-incomes`);
    },
    getTeacherRevenue: async () => {
        return await axiosClient.get(`/teacher-incomes/course-revenue`);
    },
    getTeacherIncomeByCourse: async (courseId: number) => {
        return await axiosClient.get(`/teacher-incomes/by-course?courseId=${courseId}`);
    }
};
