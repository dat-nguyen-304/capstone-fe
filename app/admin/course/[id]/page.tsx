'use client';

import Loader from '@/components/Loader';
import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import Feedback from '@/components/course/course-detail/Feedback';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import { courseApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import ApproveCourse from '@/components/course/course-detail/ApproveCourse';
interface CourseDetailProps {
    params: { id: number };
}

const CourseDetail: React.FC<CourseDetailProps> = ({ params }) => {
    const { data, isLoading } = useQuery<any>({
        queryKey: ['course'],
        queryFn: () => courseApi.getCourseByIdForAdminAndTeacher(params?.id)
    });

    const courseInfo = {
        courseName: data?.name as string,
        subject: data?.subject,
        level: data?.level,
        teacherName: data?.teacherName,
        numberOfRate: data?.numberOfRate,
        rating: data?.rating,
        totalStudent: data?.totalStudent,
        description: data?.description,
        updateDate: data?.updateDate
    };

    const approveCourse = {
        id: data?.id,
        thumbnail: data?.thumbnail,
        price: data?.price,
        subject: data?.subject,
        level: data?.level,
        totalVideo: data?.totalVideo,
        status: data?.status
    };

    const courseContent = {
        id: data?.id,
        totalVideo: data?.totalVideo,
        listVideo: data?.courseVideoResponses
    };

    if (!data) return <Loader />;

    return (
        <div className="w-[98%] xl:w-[94%] mx-auto">
            <Link href="/admin/course" className="mt-4 inline-flex items-center gap-2 text-sm">
                <BsArrowLeft />
                <span>Quay lại</span>
            </Link>
            <div className="relative grid grid-cols-10 gap-4 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo courseInfo={courseInfo} />
                    <CourseContent courseContent={courseContent} isTeacherCourse={true} />
                    <Feedback />
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <ApproveCourse approveCourse={approveCourse} />
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
