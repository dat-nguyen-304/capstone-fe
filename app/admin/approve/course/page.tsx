'use client';

import { ChangeEvent, Key, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Button,
    Chip,
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
import { useCustomModal, useInputModal } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { courseApi, examApi } from '@/api-client';
import { CourseCardType } from '@/types';
import { Spin } from 'antd';
import { toast } from 'react-toastify';
import { InputModal } from '@/components/modal/InputModal';
import { courseStatusColorMap } from '@/utils';

interface CoursesProps {}

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN KHÓA HỌC', uid: 'courseName', sortable: true },
    { name: 'GIÁO VIÊN', uid: 'teacherName' },
    { name: 'MÔN HỌC', uid: 'subject' },
    { name: 'MỨC ĐỘ', uid: 'level' },
    { name: 'NGÀY TẠO', uid: 'createdDate', sortable: true },
    { name: 'CẬP NHẬT', uid: 'updateDate', sortable: true },
    { name: 'TRẠNG THÁI', uid: 'status', sortable: true },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

type Course = {
    id: number;
    courseName: string;
    teacherName: string;
    subject: string;
    level: string;
    createdAt: string;
    updatedAt: string;
    status: string;
};

const Courses: React.FC<CoursesProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set([
            'id',
            'courseName',
            'teacherName',
            'subject',
            'level',
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
    const [updateState, setUpdateState] = useState<Boolean>(false);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [declineId, setDeclineId] = useState<number>();
    const {
        status,
        error,
        data: coursesData,
        isPreviousData
    } = useQuery({
        queryKey: ['coursesApproveAdmin', { page, rowsPerPage, updateState }],
        queryFn: () => courseApi.getCoursesVerifyListAdmin(page - 1, rowsPerPage)
    });

    useEffect(() => {
        if (coursesData?.data) {
            setCourses(coursesData.data);
            setTotalPage(coursesData.totalPage);
            setTotalRow(coursesData.totalRow);
        }
    }, [coursesData]);

    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    const { onOpen: onInputOpen, onClose: onInputClose, onDescription, description } = useInputModal();

    const handleStatusChange = async (id: number, verifyStatus: string) => {
        let toastLoading;
        console.log({ description, id, verifyStatus });
        try {
            onClose();
            onInputClose();
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            const res = await courseApi.changeCourseStatus({
                id,
                reason: description,
                verifyStatus
            });
            console.log(res);

            if (!res.data.code) {
                if (verifyStatus == 'ACCEPTED') {
                    const updateRes = await examApi.updateQuizDraftToQuiz(res?.data, id);
                    if (!updateRes) {
                        toast.success('Khóa học đã được duyệt thành công');
                    } else {
                        toast.error('Khóa học duyệt thất bại');
                    }
                } else if (verifyStatus == 'REJECT') {
                    toast.success('Đã từ chối khóa học thành công');
                }
                toast.dismiss(toastLoading);
                setUpdateState(prev => !prev);
            }
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error changing user status', error);
        }
    };

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

    const onApproveOpen = (id: number) => {
        onWarning({
            title: 'Xác nhận duyệt',
            content: 'Khóa học sẽ được hiện thị sau khi được duyệt. Bạn chắc chứ?',
            activeFn: () => handleStatusChange(id, 'ACCEPTED')
        });
        onOpen();
    };

    const onDeclineOpen = (id: number) => {
        onDanger({
            title: 'Xác nhận từ chối',
            content: 'Khóa học sẽ không được hiển thị sau khi đã từ chối. Bạn chắc chứ?',
            activeFn: () => {
                onClose();
                onInputOpen();
            }
        });
        setDeclineId(id);
        onOpen();
    };

    const renderCell = useCallback((course: any, columnKey: Key) => {
        const cellValue = course[columnKey as keyof any];

        switch (columnKey) {
            case 'teacherName':
                return (
                    <User
                        avatarProps={{
                            radius: 'full',
                            size: 'sm',
                            src: course.teacherAvatar ? course.teacherAvatar : 'https://i.pravatar.cc/150?img=4'
                        }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    />
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
                            <DropdownMenu aria-label="Options">
                                <DropdownItem color="success" onClick={() => onApproveOpen(course?.id)}>
                                    Duyệt
                                </DropdownItem>
                                <DropdownItem color="danger" onClick={() => onDeclineOpen(course?.id)}>
                                    Từ chối
                                </DropdownItem>
                                <DropdownItem color="primary" as={Link} href={`/admin/approve/course/${course.id}`}>
                                    Xem chi tiết
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case 'status':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={cellValue === 'WAITING' ? 'warning' : 'secondary'}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'WAITING' ? 'Chờ xác thực' : 'Chờ cập nhật'}
                    </Chip>
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

    console.log({ courses });

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Khóa học chờ phê duyệt</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                <div className="flex flex-col gap-4 mt-8">
                    <div className="sm:flex justify-between gap-3 items-end">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[50%] border-1"
                            placeholder="Tìm kiếm..."
                            startContent={<BsSearch className="text-default-300" />}
                            value={filterValue}
                            color="primary"
                            variant="bordered"
                            onClear={() => setFilterValue('')}
                            onValueChange={onSearchChange}
                        />
                        <div className="flex gap-3 mt-4 sm:mt-0">
                            <Dropdown>
                                <DropdownTrigger className="flex">
                                    <Button
                                        endContent={<BsChevronDown className="text-small" />}
                                        size="sm"
                                        variant="bordered"
                                        color="primary"
                                    >
                                        Trạng thái
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu disallowEmptySelection closeOnSelect={false} selectionMode="single">
                                    <DropdownItem className="capitalize">Chờ xác thực</DropdownItem>
                                    <DropdownItem className="capitalize">Chờ cập nhật</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown>
                                <DropdownTrigger className="flex">
                                    <Button
                                        endContent={<BsChevronDown className="text-small" />}
                                        size="sm"
                                        variant="bordered"
                                        color="primary"
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
            <InputModal activeFn={() => handleStatusChange(declineId as number, 'REJECT')} />
        </div>
    );
};

export default Courses;
