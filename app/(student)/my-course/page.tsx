'use client';

import { courseApi } from '@/api-client';
import CourseCard from '@/components/course/CourseCard';
import { useUser } from '@/hooks';
import { CourseCardType } from '@/types';
import { Pagination } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

interface CourseListProps {}

const CourseList: React.FC<CourseListProps> = ({}) => {
    const { user } = useUser();
    const router = useRouter();
    const [courses, setCourses] = useState<CourseCardType[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const { status, error, data, isPreviousData } = useQuery({
        queryKey: ['my-courses', { page }],
        // keepPreviousData: true,
        queryFn: () => courseApi.getEnrollCourse(page - 1)
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

    if (!data) return <Loader />;

    if (!user) {
        router.push('/auth');
    }

    return (
        <div className="w-[90%] 2xl:w-[85%] 3xl:w-[90%] mx-auto my-8">
            <h3 className="text-xl font-semibold text-blue-500 mt-4 sm:mt-0">Khóa học của tôi</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                <div className="mt-8 mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:cols-5">
                    {courses.length ? (
                        courses.map((courseItem: CourseCardType) => (
                            <CourseCard type="my-course" key={courseItem.id} course={courseItem} />
                        ))
                    ) : (
                        <div className="text-sm sm:text-base text-center">Bạn chưa mua khóa học nào</div>
                    )}
                </div>
                {totalPage && totalPage > 1 ? (
                    <div className="flex justify-center my-8">
                        <Pagination page={page} total={totalPage} onChange={value => scrollToTop(value)} showControls />
                    </div>
                ) : (
                    <></>
                )}
            </Spin>
        </div>
    );
};

export default CourseList;
