'use client';

import BuyCourse from '@/components/courses/CourseDetail/BuyCourse';
import CourseContent from '@/components/courses/CourseDetail/CourseContent';
import CourseInfo from '@/components/courses/CourseDetail/CourseInfo';

interface CourseDetailProps {}

const CourseDetail: React.FC<CourseDetailProps> = ({}) => {
    return (
        <div className="w-[80%] mx-auto mt-8 ">
            <div className="relative grid grid-cols-10 gap-2">
                <div className="col-span-7">
                    <CourseInfo />
                    <CourseContent />
                </div>
                <div className="col-span-3">
                    <BuyCourse />
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
