'use client';
import { ChangeEvent, Key, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Button,
    Chip,
    ChipProps,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Selection,
    SortDescriptor,
    User
} from '@nextui-org/react';
import Link from 'next/link';
import { BsChevronDown, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
import TableContent from '@/components/table';
import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/api-client';
import Loader from '@/components/Loader';
import { CourseCardType } from '@/types';
import { Spin } from 'antd';

interface CoursesProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    AVAILABLE: 'success',
    BANNED: 'danger',
    WAITING: 'primary',
    UNAVAILABLE: 'warning'
};

const columns = [
    // { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN KHÓA HỌC', uid: 'courseName', sortable: true },
    { name: 'GIÁO VIÊN', uid: 'teacherName' },
    { name: 'MÔN HỌC', uid: 'subject' },
    { name: 'MỨC ĐỘ', uid: 'level' },
    { name: 'ĐÁNH GIÁ', uid: 'rating' },
    { name: 'NGÀY TẠO', uid: 'createdDate', sortable: true },
    { name: 'CẬP NHẬT', uid: 'updateDate', sortable: true },
    { name: 'TRẠNG THÁI', uid: 'status' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const courses = [
    {
        id: 1,
        courseName: 'Lấy gốc thần tốc',
        teacherName: 'Nguyễn Văn A',
        subject: 'Toán học',
        level: 'Cơ bản',
        rating: '4.4',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023',
        status: 'active'
    },
    {
        id: 2,
        courseName: 'Lấy gốc thần tốc',
        teacherName: 'Nguyễn Văn A',
        subject: 'Toán học',
        level: 'Cơ bản',
        rating: '4.4',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023',
        status: 'unActive'
    },
    {
        id: 3,
        courseName: 'Lấy gốc thần tốc',
        teacherName: 'Nguyễn Văn A',
        subject: 'Toán học',
        level: 'Cơ bản',
        rating: '4.4',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023',
        status: 'active'
    },
    {
        id: 4,
        courseName: 'Lấy gốc thần tốc',
        teacherName: 'Nguyễn Văn A',
        subject: 'Toán học',
        level: 'Cơ bản',
        rating: '4.4',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023',
        status: 'waiting'
    },
    {
        id: 5,
        courseName: 'Lấy gốc thần tốc',
        teacherName: 'Nguyễn Văn A',
        subject: 'Toán học',
        level: 'Cơ bản',
        rating: '4.4',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023',
        status: 'updating'
    }
];

type Course = (typeof courses)[0];

const Courses: React.FC<CoursesProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set([
            'courseName',
            'teacherName',
            'subject',
            'level',
            'rating',
            'createdDate',
            'updateDate',
            'status',
            'action'
        ])
    );
    const [courses, setCourses] = useState<CourseCardType[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [updateState, setUpdateState] = useState<Boolean>(false);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const {
        status,
        error,
        data: coursesData,
        isPreviousData
    } = useQuery({
        queryKey: [
            'coursesAdmin',
            { page, rowsPerPage, statusFilter: Array.from(statusFilter)[0] as string, updateState }
        ],
        queryFn: () => courseApi.getAllOfAdmin(Array.from(statusFilter)[0] as string, page - 1, rowsPerPage)
    });

    useEffect(() => {
        if (coursesData?.data) {
            setCourses(coursesData.data);
            setTotalPage(coursesData.totalPage);
            setTotalRow(coursesData.totalRow);
        }
    }, [coursesData]);

    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue('');
        }
    }, []);
    const renderCell = useCallback((course: Course, columnKey: Key) => {
        const cellValue = course[columnKey as keyof Course];

        switch (columnKey) {
            case 'teacherName':
                return (
                    <User
                        avatarProps={{ radius: 'full', size: 'sm', src: 'https://i.pravatar.cc/150?img=4' }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    />
                );
            case 'status':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[course.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'AVAILABLE'
                            ? 'Hoạt động'
                            : cellValue === 'WAITING'
                            ? 'Chờ xác thực'
                            : cellValue === 'BANNED'
                            ? 'Bị Từ chối'
                            : 'Vô hiệu'}
                    </Chip>
                );
            case 'action':
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <BsThreeDotsVertical className="text-default-400" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem color="primary" as={Link} href="/admin/preview/course/1">
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem color="danger">Vô hiệu hóa</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case 'createdDate':
            case 'updateDate':
                const dateValue = cellValue ? new Date(cellValue) : new Date();

                const formattedDate = new Intl.DateTimeFormat('en-GB', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                })?.format(dateValue);

                return formattedDate;
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Danh sách khóa học</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                <div className="flex flex-col gap-4 mt-8">
                    <div className="flex justify-between gap-3 items-end">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[50%] border-1"
                            placeholder="Tìm kiếm..."
                            size="sm"
                            startContent={<BsSearch className="text-default-300" />}
                            value={filterValue}
                            variant="bordered"
                            onClear={() => setFilterValue('')}
                            onValueChange={onSearchChange}
                        />
                        <div className="flex gap-3">
                            <Dropdown>
                                <DropdownTrigger className="hidden sm:flex">
                                    <Button
                                        endContent={<BsChevronDown className="text-small" />}
                                        size="sm"
                                        variant="flat"
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
                                    <DropdownItem key="AVAILABLE" className="capitalize">
                                        {capitalize('Hoạt Động')}
                                    </DropdownItem>
                                    <DropdownItem key="WAITTING" className="capitalize">
                                        {capitalize('Đợi Xác Thực')}
                                    </DropdownItem>
                                    <DropdownItem key="UNAVAILABLE" className="capitalize">
                                        {capitalize('Vô Hiệu')}
                                    </DropdownItem>
                                    <DropdownItem key="BANNED" className="capitalize">
                                        {capitalize('Bị Từ Chối')}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown>
                                <DropdownTrigger className="flex">
                                    <Button
                                        endContent={<BsChevronDown className="text-small" />}
                                        size="sm"
                                        variant="flat"
                                    >
                                        Cột
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={visibleColumns}
                                    selectionMode="multiple"
                                    onSelectionChange={setVisibleColumns}
                                >
                                    {columns.map(column => (
                                        <DropdownItem key={column.uid} className="capitalize">
                                            {capitalize(column.name)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sm:flex justify-between items-center">
                        <span className="text-default-400 text-xs sm:text-sm">Tìm thấy {totalRow} kết quả</span>
                        <label className="flex items-center text-default-400 text-xs sm:text-sm">
                            Số kết quả mỗi trang:
                            <select
                                className="bg-transparent outline-none text-default-400 text-xs sm:text-sm"
                                onChange={onRowsPerPageChange}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                        </label>
                    </div>
                </div>
                <TableContent
                    renderCell={renderCell}
                    headerColumns={headerColumns}
                    items={courses || []}
                    page={page}
                    setPage={setPage}
                    sortDescriptor={sortDescriptor}
                    setSortDescriptor={setSortDescriptor}
                    totalPage={totalPage || 1}
                />
            </Spin>
        </div>
    );
};

export default Courses;
