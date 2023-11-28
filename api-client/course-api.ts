import { ChangeCourseStatus, CourseCardType, CreateCourse } from '@/types';
import axiosClient from './axios-client';
import axiosFormData from './axios-form';
export const courseApi = {
    getAll: async (page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(`/courses/user?page=${page}&size=${size}&field=${field}&sortType=${sort}`);
        return res.data;
    },
    searchCourse: async (searchTerm: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/courses/search?searchTerm=${searchTerm}&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    filterCourse: async (filter: string, values: [], page: number, size: number, field: string, sort: string) => {
        const valuesString = values.length ? `&value=${values.join('&value=')}` : '';
        const res = await axiosClient.get(
            `/courses/filter?filterBy=${filter}${valuesString}&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getCourseById: async (courseId: number) => {
        const res = await axiosClient.get(`/courses/detail?id=${courseId}`);
        return res.data;
    },
    getAllOfTeacher: async (page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(`/courses/teacher?page=${page}&size=${size}&field=${field}&sortType=${sort}`);
        return res.data;
    },
    getAllOfTeacherDraft: async (page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/courses/teacher/waiting-list?page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getAllOfAdmin: async (commonStatus: string, page: number, size: number) => {
        const res = await axiosClient.get(
            `/courses/admin?commonStatus=${commonStatus}&page=${page}&size=${size}&sortType=ASC`
        );
        return res.data;
    },
    changeCourseStatus: async (payload: any) => {
        return await axiosClient.post('/courses/admin/verify-course', payload);
    },
    createCourse: async (payload: any) => {
        return await axiosFormData.post('/courses/teacher/create', payload);
    },
    getCourseByIdForAdminAndTeacher: async (courseId: number) => {
        const res = await axiosClient.get(`/courses/detail/teacher?id=${courseId}`);
        return res.data;
    },
    getCourseDraftById: async (courseDraftId: number) => {
        const res = await axiosClient.get(`/courses/admin/detail/draft?id=${courseDraftId}`);
        return res.data;
    },
    updateCourse: async (payload: any) => {
        return await axiosFormData.put('/courses/teacher/update', payload);
    },
    updateDraftCourse: async (payload: any) => {
        return await axiosFormData.put('/courses/teacher/edit-waiting-course', payload);
    },
    getEnrollCourse: async (page: number) => {
        const res = await axiosClient.get(`/enroll-course?page=${page}&size=20&sortType=ASC`);
        return res.data;
    },
    TeacherSendVerifyCourse: async (payload: any) => {
        return await axiosClient.put('/courses/teacher/send-verify-request', payload);
    },
    getCoursesVerifyListAdmin: async (page: number, size: number) => {
        const res = await axiosClient.get(`/courses/admin/verify-list?page=${page}&size=${size}&sortType=ASC`);
        return res.data;
    },
    getCourseForPublicProfile: async (email: string, page: number, size: number) => {
        const res = await axiosClient.get(
            `/courses/user/find-by-email?email=${email}&page=${page}&size=${size}&sortType=ASC`
        );
        return res.data;
    },
    deleteCourse: async (courseId: number) => {
        return await axiosClient.delete(`/courses/teacher?courseId=${courseId}`);
    },
    deleteCourseDraft: async (courseId: number) => {
        return await axiosClient.delete(`/courses/teacher/draft?courseId=${courseId}`);
    }
};
