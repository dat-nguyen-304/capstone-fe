import axiosClient from './axios-client';
export const teacherIncomeApi = {
    getTeacherIncome: async () => {
        const res = await axiosClient.get(`/teacher-incomes`);
        return res?.data;
    },
    getTeacherTopIncome: async (status: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/teacher-incomes/income?status=${status}&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res?.data;
    },
    getTeacherRevenue: async () => {
        const res = await axiosClient.get(`/teacher-incomes/course-revenue`);
        return res?.data;
    },
    getTeacherIncomeByCourse: async (courseId: number) => {
        return await axiosClient.get(`/teacher-incomes/by-course?courseId=${courseId}`);
    },
    getTeacherIncomeForAdmin: async (status: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/teacher-incomes/admin/income?status=${status}&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res?.data;
    },
    adminPaymentTeacher: async (payload: any) => {
        return await axiosClient.put(`/teacher-incomes/admin/payment`, payload);
    }
};
