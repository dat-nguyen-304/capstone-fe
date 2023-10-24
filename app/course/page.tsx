'use client';

import CourseCard from '@/components/course/CourseCard';
import CourseFilter from '@/components/course/CourseFilter';

interface CourseListProps {}

const CourseList: React.FC<CourseListProps> = ({}) => {
    return (
        <div className="w-[90%] mx-auto mt-8">
            <CourseFilter />
            <p className="mt-6 text-sm font-semibold">Tìm thấy 5 kết quả</p>
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <CourseCard />
                <CourseCard />
                <CourseCard />
                <CourseCard />
                <CourseCard />
            </div>
        </div>
    );
};

export default CourseList;
