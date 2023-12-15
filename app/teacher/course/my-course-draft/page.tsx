'use client';

import React, { useEffect, useState } from 'react';

import CourseCard from '@/components/course/CourseCard';
import { courseApi } from '@/api-client';
import { CourseCardType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Pagination,
    Selection
} from '@nextui-org/react';
import { useSelectedSidebar, useUser } from '@/hooks';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';

interface MyCourseDraftProps {}

const MyCourseDraft: React.FC<MyCourseDraftProps> = ({}) => {
    const [courses, setCourses] = useState<CourseCardType[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const [sortFilter, setSortFilter] = useState<Selection>(new Set(['DEFAULT']));
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [search, setSearch] = useState<string>('');
    const [searchInput, setSearchInput] = useState('');
    const currentUser = useUser();
    const { status, error, data, isPreviousData } = useQuery({
        queryKey: [
            'coursesDraft',
            {
                page,
                sortFilter: Array.from(sortFilter)[0] as string,
                search,
                statusFilter: Array.from(statusFilter)[0] as string
            }
        ],
        // keepPreviousData: true,
        queryFn: () =>
            courseApi.getAllOfTeacherDraft(
                search,
                Array.from(statusFilter)[0] as string,
                page - 1,
                20,
                Array.from(sortFilter)[0] === 'DEFAULT' || Array.from(sortFilter)[0] === 'CREATEDDATE'
                    ? 'createdDate'
                    : 'price',
                Array.from(sortFilter)[0] === 'DEFAULT' || Array.from(sortFilter)[0] === 'PRICE_DESC' ? 'DESC' : 'ASC'
            )
    });

    useEffect(() => {
        if (data?.data) {
            setCourses(data.data);
            setTotalPage(data.totalPage);
            setTotalRow(data.totalRow);
        }
    }, [data]);

    const statusArr = [
        {
            value: 'REJECT',
            name: 'Đã từ chối'
        },
        {
            value: 'DRAFT',
            name: 'Bản nháp'
        },
        {
            value: 'WAITING',
            name: 'Chờ phê duyệt'
        },
        {
            value: 'UPDATING',
            name: 'Chờ cập nhật'
        }
    ];
    const { onTeacherKeys } = useSelectedSidebar();
    const handleSearch = (searchInput: string) => {
        // Set the search state
        setSearch(searchInput);
    };

    useEffect(() => {
        setPage(1);
    }, [statusFilter, sortFilter, search]);

    useEffect(() => {
        onTeacherKeys(['8']);
    }, []);
    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };

    return (
        <div className="w-[98%] xl:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Khóa học vừa tạo</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                <div className="mt-8 sm:flex justify-between gap-3 items-end">
                    <div className="flex flex-[1] gap-2 md:mt-0 mt-4">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[50%] border-1"
                            placeholder="Tìm kiếm..."
                            startContent={<BsSearch className="text-default-300" />}
                            value={searchInput}
                            variant="bordered"
                            color="primary"
                            onClear={() => {
                                setSearchInput('');
                                handleSearch('');
                            }}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        <Button color="primary" className="" onClick={() => handleSearch(searchInput)}>
                            Tìm kiếm
                        </Button>
                    </div>
                    <div className="flex ml-auto gap-3 mt-4 sm:mt-0">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<BsChevronDown className="text-small" />}
                                    size="sm"
                                    variant="bordered"
                                    color="primary"
                                >
                                    Trạng thái
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="single"
                                onSelectionChange={setStatusFilter}
                            >
                                <DropdownItem key="ALL" className="capitalize">
                                    {capitalize('Tất Cả')}
                                </DropdownItem>
                                <DropdownItem key="DRAFT" className="capitalize">
                                    {capitalize('Khóa học nháp')}
                                </DropdownItem>
                                <DropdownItem key="WAITING" className="capitalize">
                                    {capitalize('Khóa học chờ xác thực')}
                                </DropdownItem>
                                <DropdownItem key="UPDATING" className="capitalize">
                                    {capitalize('Khóa học chờ cập nhật')}
                                </DropdownItem>
                                <DropdownItem key="REJECT" className="capitalize">
                                    {capitalize('Khóa học bị từ chối')}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="flex">
                                <Button
                                    endContent={<BsChevronDown className="text-small" />}
                                    size="sm"
                                    color="primary"
                                    variant="bordered"
                                >
                                    Sắp Xếp Theo
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={sortFilter}
                                selectionMode="single"
                                onSelectionChange={setSortFilter}
                            >
                                <DropdownItem key="DEFAULT" className="capitalize">
                                    {capitalize('Khóa học mới nhất')}
                                </DropdownItem>
                                <DropdownItem key="CREATEDDATE" className="capitalize">
                                    {capitalize('Khóa học cũ nhất')}
                                </DropdownItem>
                                <DropdownItem key="PRICE_DESC" className="capitalize">
                                    {capitalize('Giá cao nhất')}
                                </DropdownItem>
                                <DropdownItem key="PRICE_ASC" className="capitalize">
                                    {capitalize('Giá thấp nhất')}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                {totalRow ? (
                    <p className="mt-4 text-default-400 text-xs sm:text-sm">Tìm thấy {totalRow} kết quả</p>
                ) : null}
                <div className="min-h-[300px] mb-8 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-3">
                    {courses.length ? (
                        courses.map((courseItem: CourseCardType) => (
                            <CourseCard key={courseItem.id} course={courseItem} type="teacher-course-draft" />
                        ))
                    ) : (
                        <></>
                    )}
                </div>
                {totalPage && totalPage > 1 ? (
                    <div className="flex justify-center my-8">
                        <Pagination page={page} total={totalPage} onChange={value => scrollToTop(value)} showControls />
                    </div>
                ) : null}
            </Spin>
        </div>
    );
};

export default MyCourseDraft;
