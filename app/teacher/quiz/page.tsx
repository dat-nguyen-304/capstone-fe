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
    SortDescriptor
} from '@nextui-org/react';
import Link from 'next/link';
import { BsChevronDown, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
import TableContent from '@/components/table';
import { useCustomModal, useSelectedSidebar } from '@/hooks';
import { courseApi, examApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';

interface MyQuizProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    ENABLE: 'success',
    DISABLE: 'danger',
    DELETED: 'danger',
    BANNED: 'danger'
};

const columns = [
    { name: 'TIÊU ĐỀ', uid: 'name', sortable: false },
    { name: 'KHÓA HỌC', uid: 'course', sortable: false },
    { name: 'KIỂU BÀI TẬP', uid: 'examType' },
    { name: 'ĐÃ TẠO', uid: 'createTime', sortable: false },
    { name: 'TRẠNG THÁI', uid: 'status' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const MyQuiz: React.FC<MyQuizProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['name', 'course', 'examType', 'createTime', 'status', 'action'])
    );
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [statusFilterExamType, setStatusFilterExamType] = useState<Selection>(new Set(['ALL']));
    const [statusFilterStatus, setStatusFilterStatus] = useState<Selection>(new Set(['ALL']));
    const [selectedSubject, setSelectedSubject] = useState(0);
    const [selectedFilterSort, setSelectedFilterSort] = useState(0);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [search, setSearch] = useState<string>('');
    const [searchInput, setSearchInput] = useState('');
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const { status, error, data, isPreviousData, refetch } = useQuery({
        queryKey: [
            'examsByTeacher',
            {
                page,
                selectedSubject,
                selectedFilterSort,
                search,
                statusFilter: Array.from(statusFilter)[0] as string,
                statusFilterExamType: Array.from(statusFilterExamType)[0] as string,
                statusFilterStatus: Array.from(statusFilterStatus)[0] as string
            }
        ],
        // keepPreviousData: true,
        queryFn: () =>
            examApi.getQuizByOwnerId(
                search,
                Array.from(statusFilter)[0] === 'ALL' ? '' : (Array.from(statusFilter)[0] as string),
                Array.from(statusFilterExamType)[0] === 'ALL' ? '' : (Array.from(statusFilterExamType)[0] as string),
                Array.from(statusFilterStatus)[0] === 'ALL' ? '' : (Array.from(statusFilterStatus)[0] as string),
                page - 1,
                rowsPerPage,
                'createTime',
                'DESC'
            )
    });
    const { data: coursesData } = useQuery({
        queryKey: ['coursesList'],
        queryFn: () => courseApi.getAllOfTeacher('', 'AVAILABLE', 0, 100, 'createdDate', 'DESC')
    });
    const { data: updatingCoursesData, isLoading: isUpdatingCourseLoading } = useQuery({
        queryKey: ['draftCoursesList'],
        queryFn: () => courseApi.getAllOfTeacherDraft('', 'ALL', 0, 100, 'createdDate', 'DESC')
    });
    useEffect(() => {
        if (data?.data) {
            const quizzesWithCourses = data.data.map((quiz: any) => {
                let courseName = null;

                if (quiz.examType === 'QUIZ_DRAFT' && updatingCoursesData?.data) {
                    // If the examType is 'QUIZ_DRAFT', find the corresponding course in updatingCoursesData
                    const matchingCourse = updatingCoursesData?.data?.find(
                        (course: any) => course.id === quiz.courseId
                    );
                    courseName = matchingCourse?.id === quiz.courseId ? matchingCourse.courseName : null;
                } else if (coursesData?.data) {
                    // For other examTypes, find the corresponding course in coursesData
                    const matchingCourse = coursesData?.data?.find((course: any) => course.id === quiz.courseId);
                    courseName = matchingCourse?.id === quiz.courseId ? matchingCourse.courseName : null;
                }

                return {
                    ...quiz,
                    course: courseName
                };
            });

            setQuizzes(quizzesWithCourses);
            setTotalPage(data.totalPage);
            setTotalRow(data.totalRow);
        }
    }, [data, coursesData]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, statusFilterStatus, statusFilterExamType, search]);

    const handleSearch = (searchInput: string) => {
        // Set the search state
        setSearch(searchInput);
    };
    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();

    const handleStatusChange = async (id: number) => {
        try {
            onLoading();
            const res = await examApi.deleteExam(id);
            if (!res.data.code) {
                onSuccess({
                    title: 'Đã vô hiệu hóa bài tập thành công',
                    content: 'Bài tập đã bị vô hiệu hóa thành công'
                });
                refetch();
            }
        } catch (error) {
            // Handle error
            onDanger({
                title: 'Có lỗi xảy ra',
                content: 'Hệ thống gặp trục trặc, thử lại sau ít phút'
            });
            console.error('Error changing user status', error);
        }
    };

    const onDeactivateOpen = (id: number) => {
        onDanger({
            title: `Xác nhận vô hiệu hóa`,
            content: `Bài tập này sẽ không được hiện thị sau khi vô hiệu hóa Bạn chắc chứ?`,
            activeFn: () => handleStatusChange(id)
        });
        onOpen();
    };

    const { onTeacherKeys } = useSelectedSidebar();

    useEffect(() => {
        onTeacherKeys(['10']);
    }, []);
    const renderCell = useCallback((quiz: any, columnKey: Key) => {
        const cellValue = quiz[columnKey as keyof any];

        switch (columnKey) {
            case 'examType':
                let type =
                    cellValue === 'QUIZ' ? 'Bài tập' : cellValue === 'QUIZ_DRAFT' ? 'Bài tập chờ duyệt' : 'Vô Hiệu';

                return type;
            case 'status':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[quiz.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'ENABLE'
                            ? 'Hoạt động'
                            : cellValue === 'DELETED'
                            ? 'Đã xóa'
                            : cellValue === 'BANNED'
                            ? 'Bị cấm'
                            : 'Vô Hiệu'}
                    </Chip>
                );
            case 'createTime':
                const dateValue = cellValue ? new Date(cellValue) : new Date();

                const formattedDate = new Intl.DateTimeFormat('en-GB', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                })?.format(dateValue);

                return formattedDate;
            case 'action':
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <BsThreeDotsVertical className="text-default-400" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Options"
                                disabledKeys={['viewDis', 'editDis', 'enableDis', 'delDis']}
                            >
                                <DropdownItem
                                    key={
                                        quiz?.status === 'DISABLE' ||
                                        quiz?.status === 'BANNED' ||
                                        quiz?.status === 'DELETED'
                                            ? 'viewDis'
                                            : 'view'
                                    }
                                    color="primary"
                                    as={Link}
                                    href={`/teacher/quiz/${quiz?.id}`}
                                >
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem
                                    color="warning"
                                    key={
                                        quiz?.status === 'DISABLE' ||
                                        quiz?.status === 'BANNED' ||
                                        quiz?.status === 'DELETED'
                                            ? 'editDis'
                                            : 'edit'
                                    }
                                    as={Link}
                                    href={`/teacher/quiz/edit/${quiz?.id}`}
                                >
                                    Chỉnh sửa
                                </DropdownItem>
                                <DropdownItem
                                    color="danger"
                                    key={
                                        quiz?.status === 'DISABLE' ||
                                        quiz?.status === 'BANNED' ||
                                        quiz?.status === 'DELETED'
                                            ? 'delDis'
                                            : 'del'
                                    }
                                    onClick={() => onDeactivateOpen(quiz?.id)}
                                >
                                    Vô hiệu hóa
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Danh sách bài tập</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                <div className="flex flex-col gap-4 mt-8">
                    <div className="sm:flex justify-between gap-3 items-end">
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
                        <div className="ml-auto flex gap-3 mt-4 sm:mt-0">
                            <Dropdown>
                                <DropdownTrigger className="hidden sm:flex">
                                    <Button
                                        endContent={<BsChevronDown className="text-small" />}
                                        size="sm"
                                        variant="bordered"
                                        color="primary"
                                    >
                                        Môn học
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
                                        {capitalize('Tất cả')}
                                    </DropdownItem>
                                    <DropdownItem key="MATHEMATICS" className="capitalize">
                                        {capitalize('Toán học')}
                                    </DropdownItem>
                                    <DropdownItem key="ENGLISH" className="capitalize">
                                        {capitalize('Tiếng anh')}
                                    </DropdownItem>
                                    <DropdownItem key="PHYSICS" className="capitalize">
                                        {capitalize('Vật lí')}
                                    </DropdownItem>
                                    <DropdownItem key="CHEMISTRY" className="capitalize">
                                        {capitalize('Hóa học')}
                                    </DropdownItem>
                                    <DropdownItem key="BIOLOGY" className="capitalize">
                                        {capitalize('Sinh học')}
                                    </DropdownItem>
                                    <DropdownItem key="HISTORY" className="capitalize">
                                        {capitalize('Lịch sử')}
                                    </DropdownItem>
                                    <DropdownItem key="GEOGRAPHY" className="capitalize">
                                        {capitalize('Địa lý')}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
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
                                    selectedKeys={statusFilterStatus}
                                    selectionMode="single"
                                    onSelectionChange={setStatusFilterStatus}
                                >
                                    <DropdownItem key="ALL" className="capitalize">
                                        {capitalize('Tất cả')}
                                    </DropdownItem>
                                    <DropdownItem key="ENABLE" className="capitalize">
                                        {capitalize('Hoạt động')}
                                    </DropdownItem>
                                    <DropdownItem key="DISABLE" className="capitalize">
                                        {capitalize('Vô hiệu')}
                                    </DropdownItem>
                                    <DropdownItem key="DELETED" className="capitalize">
                                        {capitalize('Đã xóa')}
                                    </DropdownItem>
                                    <DropdownItem key="BANNED" className="capitalize">
                                        {capitalize('Bị Cấm')}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown>
                                <DropdownTrigger className="hidden sm:flex">
                                    <Button
                                        endContent={<BsChevronDown className="text-small" />}
                                        size="sm"
                                        variant="bordered"
                                        color="primary"
                                    >
                                        Loại bài tập
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={statusFilterExamType}
                                    selectionMode="single"
                                    onSelectionChange={setStatusFilterExamType}
                                >
                                    <DropdownItem key="ALL" className="capitalize">
                                        {capitalize('Tất cả')}
                                    </DropdownItem>
                                    <DropdownItem key="QUIZ" className="capitalize">
                                        {capitalize('Bài tập')}
                                    </DropdownItem>
                                    <DropdownItem key="QUIZ_DRAFT" className="capitalize">
                                        {capitalize('Bài tập chờ duyệt')}
                                    </DropdownItem>
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
                    items={quizzes}
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

export default MyQuiz;
