'use client';

import React, { useEffect, useState } from 'react';

import CourseCard from '@/components/course/CourseCard';
import { courseApi } from '@/api-client';
import { CourseCardType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { Pagination } from '@nextui-org/react';
import { useUser } from '@/hooks';

interface MyCourseProps {}

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

const MyCourse: React.FC<MyCourseProps> = ({}) => {
    const [courses, setCourses] = useState<CourseCardType[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const currentUser = useUser();
    const { status, error, data, isPreviousData } = useQuery({
        queryKey: ['courses', { page }],
        // keepPreviousData: true,
        queryFn: () => courseApi.getAllOfTeacher(currentUser.user?.email as string, page - 1)
    });

    useEffect(() => {
        if (data?.data) {
            setCourses(data.data);
            setTotalPage(data.totalPage);
            setTotalRow(data.totalRow);
        }
    }, [data]);

    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };
    console.log({ data });

    return (
        <div className="w-[98%] xl:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Khóa học của tôi</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                {totalRow && <p className="mt-6 text-sm font-semibold">Tìm thấy {totalRow} kết quả</p>}
                <div className="min-h-[300px] mb-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {courses.length ? (
                        courses.map((courseItem: CourseCardType) => (
                            <CourseCard key={courseItem.id} course={courseItem} isTeacherCourse={true} />
                        ))
                    ) : (
                        <></>
                    )}
                </div>
                {totalPage && (
                    <div className="flex justify-center my-8">
                        <Pagination page={page} total={totalPage} onChange={value => scrollToTop(value)} showControls />
                    </div>
                )}
            </Spin>
        </div>
    );
};

export default MyCourse;
