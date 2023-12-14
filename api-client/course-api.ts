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
    filterCourseForUser: async (
        subjectList: [],
        minPrice: number,
        maxPrice: number,
        minRate: number,
        maxRate: number,
        levelList: [],
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        let value = subjectList?.length ? `?subjectList=${subjectList.join('&subjectList=')}` : '';
        if (minPrice != 0 && maxPrice != 0) {
            if (value == '') {
                value += `?minPrice=${minPrice}&maxPrice=${maxPrice}`;
            } else {
                value += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
            }
        } else if (maxPrice != 0) {
            if (value == '') {
                value += `?maxPrice=${maxPrice}`;
            } else {
                value += `&maxPrice=${maxPrice}`;
            }
        } else {
            value += '';
        }
        if (minRate != 0) {
            if (value == '') {
                value += `?minRate=${minRate}&maxRate=${maxRate}`;
            } else {
                value += `&minRate=${minRate}&maxRate=${maxRate}`;
            }
        } else {
            value += '';
        }
        if (levelList?.length > 0) {
            if (value == '') {
                value += `?levelList=${levelList.join('&levelList=')}`;
            } else {
                value += `&levelList=${levelList.join('&levelList=')}`;
            }
        } else {
            value += '';
        }

        const res = await axiosClient.get(
            `/courses/user/filter${value}${
                value !== '' ? `&page=${page}` : `?page=${page}`
            }&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getCourseById: async (courseId: number) => {
        const res = await axiosClient.get(`/courses/detail?id=${courseId}`);
        return res.data;
    },
    getAllOfTeacher: async (
        search: string,
        status: string,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const res = await axiosClient.get(
            `/courses/teacher${
                search !== '' ? `?searchTerm=${search}&status=${status}` : `?status=${status}`
            }&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getAllOfTeacherDraft: async (
        search: string,
        status: string,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const res = await axiosClient.get(
            `/courses/teacher/waiting-list${
                search !== '' ? `?searchTerm=${search}&status=${status}` : `?status=${status}`
            }&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getAllOfTeacherDraftSearch: async (search: string, page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(
            `/courses/teacher/search/temporary-course${
                search !== '' ? `?searchTerm=${search}&page=${page}` : `?page=${page}`
            }&size=${size}&field=${field}&sortType=${sort}`
        );
        return res.data;
    },
    getAllOfAdmin: async (
        search: string,
        commonStatus: string,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const res = await axiosClient.get(
            `/courses/admin${
                search !== '' ? `?searchTerm=${search}&commonStatus=${commonStatus}` : `?commonStatus=${commonStatus}`
            }&page=${page}&size=${size}&field=${field}&sortType=${sort}`
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
    getEnrollCourse: async (page: number, size: number, field: string, sort: string) => {
        const res = await axiosClient.get(`/enroll-course?page=${page}&size=${size}&field=${field}&sortType=${sort}`);
        return res.data;
    },
    TeacherSendVerifyCourse: async (payload: any) => {
        return await axiosClient.put('/courses/teacher/send-verify-request', payload);
    },
    getCoursesVerifyListAdmin: async (
        search: string,
        status: string,
        page: number,
        size: number,
        field: string,
        sort: string
    ) => {
        const res = await axiosClient.get(
            `/courses/admin/verify-list${
                search !== '' ? `?searchTerm=${search}&status=${status}` : `?status=${status}`
            }&page=${page}&size=${size}&field=${field}&sortType=${sort}`
        );
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
