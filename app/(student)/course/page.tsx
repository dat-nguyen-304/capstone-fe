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
interface SelectedFilter {
    type: string;
    value: [] | any;
}
const CourseList: React.FC<CourseListProps> = ({}) => {
    const [courses, setCourses] = useState<CourseCardType[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [type, setType] = useState<number>(0);
    const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>({ type: '', value: [] });
    console.log(selectedFilter);

    const { status, error, data, isPreviousData, refetch } = useQuery({
        queryKey: ['courses', { page, searchTerm, type, selectedFilter }],
        // keepPreviousData: true,
        queryFn: () => {
            if (searchTerm !== '') {
                // If searchTerm is not empty, call searchCourse
                return courseApi.searchCourse(
                    searchTerm,
                    page - 1,
                    20,
                    type == 1 || type == 2 ? 'price' : 'id',
                    type == 1 ? 'DESC' : 'ASC'
                );
            } else if (selectedFilter.type !== '' && selectedFilter?.value?.length > 0) {
                return courseApi.filterCourse(
                    selectedFilter?.type,
                    selectedFilter?.value as [],
                    page - 1,
                    20,
                    type == 1 || type == 2 ? 'price' : 'id',
                    type == 1 ? 'DESC' : 'ASC'
                );
            } else {
                // If searchTerm is empty, call courseApi.getAll
                return courseApi.getAll(
                    page - 1,
                    20,
                    type == 1 || type == 2 ? 'price' : 'id',
                    type == 1 ? 'DESC' : 'ASC'
                );
            }
        }
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
    const handleSearch = (newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);
        console.log(searchTerm);

        setPage(1);
    };

    return (
        <div className="background-xl">
            <div className="w-[90%] 2xl:w-[85%] 3xl:w-[90%] mx-auto pt-8">
                <CourseFilter onSearch={handleSearch} setSortType={setType} setFilter={setSelectedFilter} />
                <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                    {totalRow ? (
                        <p className="mt-4 text-default-400 text-xs sm:text-sm">Tìm thấy {totalRow} kết quả</p>
                    ) : null}
                    <div className="min-h-[300px] mb-8 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:cols-5">
                        {courses.length ? (
                            courses.map((courseItem: CourseCardType) => (
                                <CourseCard key={courseItem.id} course={courseItem} />
                            ))
                        ) : (
                            <>Khóa học rỗng</>
                        )}
                    </div>
                    {totalPage && totalPage > 1 ? (
                        <div className="flex justify-center mb-16">
                            <Pagination
                                page={page}
                                total={totalPage}
                                onChange={value => scrollToTop(value)}
                                showControls
                            />
                        </div>
                    ) : null}
                </Spin>
            </div>
        </div>
    );
};

export default CourseList;
