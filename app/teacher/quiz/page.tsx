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
import { useCustomModal } from '@/hooks';
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

const getSubjectNameById = (id: number): string => {
    const subjectMap: Record<number, string> = {
        1: 'MATHEMATICS',
        2: 'PHYSICS',
        3: 'CHEMISTRY',
        4: 'ENGLISH',
        5: 'BIOLOGY',
        6: 'HISTORY',
        7: 'GEOGRAPHY'
    };

    return subjectMap[id] || '';
};
function getSubjectName(subjectCode: string) {
    const subjectNames: { [key: string]: string | null } = {
        MATHEMATICS: 'Toán học',
        ENGLISH: 'Tiếng anh',
        PHYSICS: 'Vật lí',
        CHEMISTRY: 'Hóa học',
        BIOLOGY: 'Sinh học',
        HISTORY: 'Lịch sử',
        GEOGRAPHY: 'Địa lý'
    };

    return subjectNames[subjectCode] || null;
}
const columns = [
    { name: 'ID', uid: 'id', sortable: false },
    { name: 'TIÊU ĐỀ', uid: 'name', sortable: false },
    { name: 'KHÓA HỌC', uid: 'course', sortable: false },
    { name: 'KIỂU BÀI THI', uid: 'examType' },
    { name: 'ĐÃ TẠO', uid: 'createTime', sortable: false },
    { name: 'TRẠNG THÁI', uid: 'status' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const MyQuiz: React.FC<MyQuizProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['id', 'name', 'course', 'examType', 'createTime', 'status', 'action'])
    );
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [statusFilterExamType, setStatusFilterExamType] = useState<Selection>(new Set(['ALL']));
    const [selectedSubject, setSelectedSubject] = useState(0);
    const [selectedFilterSort, setSelectedFilterSort] = useState(0);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [search, setSearch] = useState<string>('');
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
                statusFilterExamType: Array.from(statusFilterExamType)[0] as string
            }
        ],
        // keepPreviousData: true,
        queryFn: () =>
            examApi.getQuizByOwnerId(
                Array.from(statusFilter)[0] === 'ALL' ? '' : (Array.from(statusFilter)[0] as string),
                Array.from(statusFilterExamType)[0] === 'ALL' ? '' : (Array.from(statusFilterExamType)[0] as string),
                page - 1,
                rowsPerPage,
                'createTime',
                'DESC'
            )
    });
    const { data: coursesData } = useQuery({
        queryKey: ['coursesList'],
        queryFn: () => courseApi.getAllOfTeacher(0, 100, 'createdDate', 'DESC')
    });
    const { data: updatingCoursesData, isLoading: isUpdatingCourseLoading } = useQuery({
        queryKey: ['draftCoursesList'],
        queryFn: () => courseApi.getAllOfTeacherDraft(0, 100, 'createdDate', 'DESC')
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
                        {cellValue === 'ENABLE' ? 'Hoạt động' : cellValue === 'DELETED' ? 'Đã xóa' : 'Vô Hiệu'}
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
                                disabledKeys={['viewDis', 'editDis', 'enableDis', 'bannedDis']}
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
                                <DropdownItem color="danger" onClick={() => onDeactivateOpen(quiz?.id)}>
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
                        {/* <Input
                        isClearable
                        className="w-full sm:max-w-[50%] border-1"
                        placeholder="Tìm kiếm..."
                        startContent={<BsSearch className="text-default-300" />}
                        value={filterValue}
                        color="primary"
                        variant="bordered"
                        onClear={() => setFilterValue('')}
                        onValueChange={onSearchChange}
                    /> */}
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
                                        Loại bài thi
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
