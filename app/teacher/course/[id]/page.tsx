'use client';

import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import EditCourse from '@/components/course/course-detail/EditCouse';
import Feedback from '@/components/course/course-detail/Feedback';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';

interface CourseDetailProps {}

const CourseDetail: React.FC<CourseDetailProps> = ({}) => {
    return (
        <div className="w-[98%] xl:w-[90%] mx-auto">
            <Link href="/teacher/course/my-course" className="mt-4 flex items-center gap-2 text-sm">
                <BsArrowLeft />
                <span>Quay lại</span>
            </Link>
            <div className="relative grid grid-cols-10 gap-2 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo />
                    <CourseContent />
                    <Feedback />
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <EditCourse />
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;