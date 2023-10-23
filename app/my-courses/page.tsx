'use client';

import CourseCard from '@/components/courses/CourseCard';
import CourseFilter from '@/components/courses/CourseFilter';

interface CourseListProps {}

const CourseList: React.FC<CourseListProps> = ({}) => {
    return (
        <div className="w-[90%] mx-auto mt-8">
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <CourseCard isMyCourse={true} />
                <CourseCard isMyCourse={true} />
                <CourseCard isMyCourse={true} />
                <CourseCard isMyCourse={true} />
                <CourseCard isMyCourse={true} />
            </div>
        </div>
    );
};

export default CourseList;
