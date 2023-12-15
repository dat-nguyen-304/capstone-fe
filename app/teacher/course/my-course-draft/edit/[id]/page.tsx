'use client';

import { courseApi, examApi } from '@/api-client';
import Loader from '@/components/Loader';
import CommonInfo from '@/components/course/edit-course/CommonInfo';
import CourseContent from '@/components/course/edit-course/CourseContent';

import { Button, Tab, Tabs } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface EditDraftCourseProps {
    params: { id: number };
}

const EditDraftCourse: React.FC<EditDraftCourseProps> = ({ params }) => {
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const { data, isLoading, status, refetch } = useQuery<any>({
        queryKey: ['editDraftCourse', { params: params?.id }],
        queryFn: () => courseApi.getCourseDraftById(params?.id),
        staleTime: 20000
    });
    const { data: quizCourse } = useQuery<any>({
        queryKey: ['edit-course-quiz', { params: params?.id }],
        queryFn: () => examApi.getQuizCourseById(params?.id)
    });
    const { data: quizCourseRealId } = useQuery<any>({
        queryKey: ['teacher-course-draft-quiz', { params: data?.courseRealId }],
        queryFn: () => (data?.courseRealId ? examApi.getQuizCourseById(data?.courseRealId) : Promise.resolve(null))
    });
    useEffect(() => {
        if (quizCourse || quizCourseRealId) {
            setQuizzes([...(quizCourse?.data || []), ...(quizCourseRealId?.data || [])]);
        }
    }, [quizCourse, quizCourseRealId]);

    const commonInfo = {
        id: data?.id,
        name: data?.name,
        thumbnail: data?.thumbnail,
        courseRealId: data?.courseRealId,
        level: data?.level,
        description: data?.description,
        price: data?.price,
        subject: data?.subject,
        status: data?.status
    };
    const courseContent = {
        id: data?.id,
        courseRealId: data?.courseRealId,
        teacherName: data?.teacherName,
        courseName: data?.courseName,
        totalVideo: data?.courseVideoResponses?.length,
        listVideo: [...(data?.courseVideoResponses || []), ...(quizzes || [])].sort((a, b) => {
            const aOrder = a.ordinalNumber || a.courseOrder || 0;
            const bOrder = b.ordinalNumber || b.courseOrder || 0;
            return aOrder - bOrder;
        }),
        updateDate: data?.updateDate,
        thumbnail: data?.thumbnail,
        status: data?.status,
        totalQuiz: quizzes?.length
    };

    const [videoOrders, setVideoOrders] = useState<{ videoId: number; videoOrder: number; isDraft: boolean }[]>(
        data?.videoResponse
            ? data?.courseVideoResponses.map((video: any, index: number) => ({
                  videoId: video.id,
                  videoOrder: index + 1,
                  isDraft: video?.isDraft
              }))
            : []
    );

    if (!data) return <Loader />;
    return (
        <div className="w-[98%] sm:w-full lg:w-[90%] mx-auto">
            <div className="mt-4 sm:mt-0 flex justify-between">
                <h3 className="text-xl text-blue-500 font-semibold">Chỉnh sửa khóa học</h3>
                <Button size="sm" onClick={() => router.back()}>
                    Quay lại
                </Button>
            </div>
            <Tabs variant="underlined" aria-label="Tabs variants" className="mt-4">
                <Tab key="common" title="Thông tin chung" className="p-0">
                    <CommonInfo commonInfo={commonInfo} videoOrders={videoOrders} />
                </Tab>
                <Tab key="content" title="Nội dung">
                    <CourseContent courseContent={courseContent} setVideoOrders={setVideoOrders} refetch={refetch} />
                </Tab>
            </Tabs>
        </div>
    );
};

export default EditDraftCourse;
