'use client';

import BuyCourse from '@/components/courses/CourseDetail/BuyCourse';
import CourseContent from '@/components/courses/CourseDetail/CourseContent';
import CourseInfo from '@/components/courses/CourseDetail/CourseInfo';
import Feedback from '@/components/courses/CourseDetail/Feedback';
import WriteFeedback from '@/components/courses/CourseDetail/WriteFeedback';

interface CourseDetailProps {}

const CourseDetail: React.FC<CourseDetailProps> = ({}) => {
    return (
        <div className="w-[90%] lg:w-4/5 mx-auto my-16">
            <div className="relative grid grid-cols-10 gap-2">
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
