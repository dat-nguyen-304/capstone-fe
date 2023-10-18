'use client';

import BuyCourse from '@/components/courses/CourseDetail/BuyCourse';
import CourseContent from '@/components/courses/CourseDetail/CourseContent';
import CourseInfo from '@/components/courses/CourseDetail/CourseInfo';
import Feedback from '@/components/courses/CourseDetail/Feedback';
import WriteFeedback from '@/components/courses/CourseDetail/WriteFeedback';
import { Button } from '@nextui-org/react';
import { BsArrowLeft } from 'react-icons/bs';

interface CourseDetailProps {}

const CourseDetail: React.FC<CourseDetailProps> = ({}) => {
    return (
        <div className="w-[90%] lg:w-4/5 mx-auto">
            <Button className="mt-4 bg-transparent p-0">
                <BsArrowLeft />
                <span>Quay lại</span>
            </Button>
            <div className="relative grid grid-cols-10 gap-2 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo />
                    <CourseContent />
                    <WriteFeedback />
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
