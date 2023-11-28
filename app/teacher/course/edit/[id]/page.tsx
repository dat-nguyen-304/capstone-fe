'use client';

import { courseApi } from '@/api-client';
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
    const { data, isLoading, status } = useQuery<any>({
        queryKey: ['editCourse'],
        queryFn: () => courseApi.getCourseByIdForAdminAndTeacher(params?.id),
        staleTime: 20000
    });

    console.log(data);

    const commonInfo = {
        id: data?.id,
        name: data?.name,
        thumbnail: data?.thumbnail,
        level: data?.level,
        description: data?.description,
        price: data?.price,
        subject: data?.subject,
        status: data?.status
    };

    const courseContent = {
        teacherName: data?.teacherName,
        courseName: data?.courseName,
        totalVideo: data?.totalVideo,
        listVideo: data?.courseVideoResponses,
        thumbnail: data?.thumbnail,
        status: data?.status
    };

    const [videoOrders, setVideoOrders] = useState<{ videoId: number; videoOrder: number }[]>(
        data?.videoResponse
            ? data?.courseVideoResponses.map((video: any, index: number) => ({
                  videoId: video.id,
                  videoOrder: index + 1
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
                    <CourseContent courseContent={courseContent} setVideoOrders={setVideoOrders} />
                </Tab>
            </Tabs>
        </div>
    );
};

export default EditCourse;
