'use client';

import { courseApi } from '@/api-client';
import CourseCard from '@/components/course/CourseCard';
import CourseFilter from '@/components/course/CourseFilter';
import { CourseCardType } from '@/types';
import { Pagination } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';

interface CourseListProps {}

const CourseList: React.FC<CourseListProps> = ({}) => {
    const [courses, setCourses] = useState<CourseCardType[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const { status, error, data, isPreviousData } = useQuery({
        queryKey: ['courses', { page }],
        // keepPreviousData: true,
        queryFn: () => courseApi.getAll(page - 1)
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

    return (
        <div className="background-xl">
            <div className="w-[90%] 2xl:w-[85%] 3xl:w-[90%] mx-auto pt-8">
                <CourseFilter />
                <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                    {totalRow && (
                        <p className="mt-4 text-default-400 text-xs sm:text-sm">Tìm thấy {totalRow} kết quả</p>
                    )}
                    <div className="min-h-[300px] mb-8 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:cols-5">
                        {courses.length ? (
                            courses.map((courseItem: CourseCardType) => (
                                <CourseCard key={courseItem.id} course={courseItem} />
                            ))
                        ) : (
                            <></>
                        )}
                    </div>
                    {totalPage && totalPage > 1 && (
                        <div className="flex justify-center mb-16">
                            <Pagination
                                page={page}
                                total={totalPage}
                                onChange={value => scrollToTop(value)}
                                showControls
                            />
                        </div>
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default CourseList;
