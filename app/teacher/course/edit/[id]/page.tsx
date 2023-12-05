'use client';

import { courseApi, examApi } from '@/api-client';
import Loader from '@/components/Loader';
import CommonInfo from '@/components/course/edit-course/CommonInfo';
import CourseContent from '@/components/course/edit-course/CourseContent';
import { Button, Tab, Tabs } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
interface EditCourseProps {
    params: { id: number };
}

const EditCourse: React.FC<EditCourseProps> = ({ params }) => {
    const router = useRouter();
    const { data, isLoading, status, refetch } = useQuery<any>({
        queryKey: ['editCourse', { params: params?.id }],
        queryFn: () => courseApi.getCourseByIdForAdminAndTeacher(params?.id),
        staleTime: 20000
    });
    const { data: quizCourse } = useQuery<any>({
        queryKey: ['edit-course-quiz', { params: params?.id }],
        queryFn: () => examApi.getQuizCourseById(params?.id)
    });

    const commonInfo = {
        id: data?.id,
        name: data?.name,
        thumbnail: data?.thumbnail,
        level: data?.level,
        description: data?.description,
        price: data?.price,
        subject: data?.subject,
        status: data?.status,
        isDraft: data?.isDraft
    };

    const courseContent = {
        id: data?.id,
        teacherName: data?.teacherName,
        courseName: data?.courseName,
        totalVideo: data?.courseVideoResponses?.length,
        listVideo: [...(data?.courseVideoResponses || []), ...(quizCourse?.data || [])].sort((a, b) => {
            const aOrder = a.ordinalNumber || a.courseOrder || 0;
            const bOrder = b.ordinalNumber || b.courseOrder || 0;
            return aOrder - bOrder;
        }),
        updateDate: data?.updateDate,
        thumbnail: data?.thumbnail,
        status: data?.status,
        totalQuiz: quizCourse?.data?.length
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
                <Button size="sm" variant="flat" onClick={() => router.back()}>
                    <BsArrowLeft />
                    <span>Quay lại</span>
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

export default EditCourse;
