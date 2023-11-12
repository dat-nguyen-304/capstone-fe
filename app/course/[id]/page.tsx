'use client';

import BuyCourse from '@/components/course/course-detail/BuyCourse';
import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import Feedback from '@/components/course/course-detail/Feedback';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import { courseApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
interface CourseDetailProps {
    params: { id: number };
}

const CourseDetail: React.FC<CourseDetailProps> = ({ params }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['course'],
        queryFn: () => courseApi.getCourseById(params?.id)
    });
    const courseInfo = {
        courseName: data?.courseResponse?.courseName,
        subject: data?.courseResponse?.subject,
        level: data?.courseResponse?.level,
        teacherName: data?.courseResponse?.teacherName,
        numberOfRate: data?.courseResponse?.numberOfRate,
        rating: data?.courseResponse?.rating,
        totalStudent: data?.totalStudent,
        description: data?.description,
        createDate: data?.createDate
    };
    const buyCourse = {
        thumbnail: data?.courseResponse?.thumbnial,
        price: data?.courseResponse?.price,
        subject: data?.courseResponse?.subject,
        level: data?.courseResponse?.level,
        totalVideo: data?.courseResponse?.totalVideo
    };
    const courseContent = {
        totalVideo: data?.courseResponse?.totalVideo,
        listVideo: data?.videoResponse
    };
    console.log(data);
    if (!data) return <Loader />;
    return (
        <div className="w-[90%] lg:w-4/5 mx-auto">
            <Link href="/course" className="mt-4 flex items-center gap-2 text-sm">
                <BsArrowLeft />
                <span>Quay lại</span>
            </Link>
            <div className="relative grid grid-cols-10 gap-2 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo courseInfo={courseInfo} />
                    <CourseContent courseContent={courseContent} />
                    <Feedback />
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <BuyCourse buyCourse={buyCourse} />
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
