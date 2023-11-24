'use client';

import { courseApi } from '@/api-client';
import { CourseCardType } from '@/types';
import { Pagination } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import VideoCard from '../video/VideoCard';
import { Spin } from 'antd';
import CourseCard from '../course/CourseCard';
import Loader from '../Loader';

interface CourseTabProps {
    teacher: string;
}
const CourseTab: React.FC<CourseTabProps> = ({ teacher }) => {
    const [courses, setCourses] = useState<CourseCardType[]>([]);

    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: ['course-profile', { page }],
        queryFn: () => courseApi.getCourseForPublicProfile(teacher, page - 1, 20)
    });

    useEffect(() => {
        if (data?.data) {
            setCourses(data.data);
        }
    }, [data]);

    if (!data && courses.length === 0) return <Loader />;

    console.log({ courses });

    return (
        <div>
            {data.totalRow && (
                <p className="mt-4 text-default-400 text-xs sm:text-sm">Tìm thấy {data.totalRow} kết quả</p>
            )}
            <div className="min-h-[300px] mb-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {courses.length ? (
                    courses.map((courseItem: CourseCardType) => <CourseCard key={courseItem.id} course={courseItem} />)
                ) : (
                    <div className="mt-4 text-default-400 text-xs sm:text-sm">Giáo viên chưa đăng tải khóa học</div>
                )}
            </div>
            {courses.length && data.totalPage > 1 && (
                <Pagination
                    showControls
                    color="primary"
                    page={page}
                    total={data.totalPage}
                    variant="light"
                    onChange={setPage}
                />
            )}
        </div>
    );
};

export default CourseTab;
