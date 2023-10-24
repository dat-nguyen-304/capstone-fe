'use client';

import BuyCourse from '@/components/course/CourseDetail/BuyCourse';
import CourseContent from '@/components/course/CourseDetail/CourseContent';
import CourseInfo from '@/components/course/CourseDetail/CourseInfo';
import Feedback from '@/components/course/CourseDetail/Feedback';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';

interface CourseDetailProps {}

const CourseDetail: React.FC<CourseDetailProps> = ({}) => {
    return (
        <div className="w-[90%] lg:w-4/5 mx-auto">
            <Link href="/course" className="mt-4 flex items-center gap-2 text-sm">
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
                    <BuyCourse />
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
