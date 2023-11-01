'use client';

import React from 'react';

import CourseCard from '@/components/course/CourseCard';

interface MyCourseProps {}

const MyCourse: React.FC<MyCourseProps> = ({}) => {
    return (
        <div className="w-[98%] xl:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Khóa học của tôi</h3>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
            </div>
        </div>
    );
};

export default MyCourse;
