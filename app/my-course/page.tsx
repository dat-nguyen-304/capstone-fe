'use client';

import CourseCard from '@/components/course/CourseCard';

interface CourseListProps {}

const mockApi = {
    id: 1,
    thumbnail: 'abc',
    courseName: 'Khoa hoc cap toc',
    teacherName: 'Teacher A',
    rating: 5,
    numberOfRate: 30,
    totalVideo: 30,
    subject: 'Vật lý',
    level: 'Cơ bản',
    price: 500000
};
const CourseList: React.FC<CourseListProps> = ({}) => {
    return (
        <div className="w-[90%] mx-auto mt-8">
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <CourseCard isMyCourse={true} course={mockApi} />
                <CourseCard isMyCourse={true} course={mockApi} />
                <CourseCard isMyCourse={true} course={mockApi} />
                <CourseCard isMyCourse={true} course={mockApi} />
                <CourseCard isMyCourse={true} course={mockApi} />
            </div>
        </div>
    );
};

export default CourseList;
