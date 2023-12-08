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
import { courseApi, examApi } from '@/api-client';
import { useCustomModal } from '@/hooks';
import { Spin } from 'antd';

interface VideosProps {}

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
const statusColorMap: Record<string, ChipProps['color']> = {
    ENABLE: 'success',
    DISABLE: 'danger',
    DELETED: 'danger',
    BANNED: 'danger'
};

const columns = [
    { name: 'TÊN QUIZ', uid: 'name', sortable: true },
    { name: 'KHÓA HỌC', uid: 'course' },
    { name: 'MÔN HỌC', uid: 'subject' },
    { name: 'GIÁO VIÊN', uid: 'ownerFullName' },
    // { name: 'SỐ CÂU HỎI', uid: 'numberOfQuestion' },
    { name: 'NGÀY TẠO', uid: 'createTime', sortable: true },
    { name: 'CẬP NHẬT', uid: 'lastUpdateTime', sortable: true },
    { name: 'TRẠNG THÁI', uid: 'status' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const quizzes = [
    {
        id: 1,
        quizName: 'Luyện tập abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        numberOfQuestion: '10',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023',
        status: 'active'
    },
    {
        id: 2,
        quizName: 'Luyện tập abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        numberOfQuestion: '10',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023',
        status: 'active'
    },
    {
        id: 3,
        quizName: 'Luyện tập abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        numberOfQuestion: '10',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023',
        status: 'active'
    },
    {
        id: 4,
        quizName: 'Luyện tập abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        numberOfQuestion: '10',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023',
        status: 'active'
    },
    {
        id: 5,
        quizName: 'Luyện tập abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        numberOfQuestion: '10',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023',
        status: 'active'
    },
    {
        id: 6,
        quizName: 'Luyện tập abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        numberOfQuestion: '10',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023',
        status: 'active'
    }
];

type Quiz = (typeof quizzes)[0];

const Quizzes: React.FC<VideosProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set([
            'name',
            'course',
            'ownerFullName',
            'subject',
            // 'numberOfQuestion',
            'createTime',
            'lastUpdateTime',
            'status',
            'action'
        ])
    );

    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [statusFilterStatus, setStatusFilterStatus] = useState<Selection>(new Set(['ALL']));
    const [quizzesData, setQuizzesData] = useState<any[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const { status, error, data, isPreviousData, refetch } = useQuery({
        queryKey: [
            'exams',
            {
                page,
                rowsPerPage,
                statusFilter: Array.from(statusFilter)[0] as string,
                statusFilterStatus: Array.from(statusFilterStatus)[0] as string
            }
        ],
        // keepPreviousData: true,
        queryFn: () =>
            examApi.getAllByAdmin(
                Array.from(statusFilter)[0] === 'ALL' ? '' : (Array.from(statusFilter)[0] as string),
                'QUIZ',
                Array.from(statusFilterStatus)[0] === 'ALL' ? '' : (Array.from(statusFilterStatus)[0] as string),
                page - 1,
                rowsPerPage,
                'createTime',
                'DESC'
            )
    });
    const { data: coursesData } = useQuery({
        queryKey: ['quizzescoursesAdmin'],
        queryFn: () => courseApi.getAllOfAdmin('ALL', 0, 100)
    });
    useEffect(() => {
        if (data?.data) {
            const quizzesWithCourses = data?.data?.map((quiz: any) => {
                const matchingCourse = coursesData?.data?.find((course: any) => course.id === quiz.courseId);
                return {
                    ...quiz,
                    course: matchingCourse?.id === quiz.courseId ? matchingCourse?.courseName : null
                };
            });
            setQuizzesData(quizzesWithCourses);
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

    const handleStatusChange = async (id: number, status: string) => {
        try {
            onLoading();
            const res = await examApi.updateStatusExam(id, status);
            if (!res.data.code) {
                onSuccess({
                    title: `${
                        status === 'ENABLE'
                            ? 'Đã kích hoạt thành công'
                            : status === 'BANNED'
                            ? 'Đã cấm bài tập thành công'
                            : 'Đã vô hiệu hóa bài thi thành công'
                    } `,
                    content: `${
                        status === 'ENABLE'
                            ? 'Đã kích hoạt thành công'
                            : status === 'BANNED'
                            ? 'Bài tập đã bị cấm thành công'
                            : 'Bài thi đã bị vô hiệu hóa thành công'
                    } `
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

    const onActivateOpen = (id: number, status: string) => {
        onWarning({
            title: `Xác nhận kích hoạt`,
            content: `Bài thi này sẽ được hiện thị sau khi kích hoạt. Bạn chắc chứ?`,
            activeFn: () => handleStatusChange(id, status)
        });
        onOpen();
    };
    const onDeactivateOpen = (id: number, status: string) => {
        onDanger({
            title: `Xác nhận ${status === 'BANNED' ? 'cấm' : 'vô hiệu hóa'}`,
            content: `Bài thi này sẽ không được hiện thị sau khi  ${
                status === 'BANNED' ? 'cấm' : 'vô hiệu hóa'
            }. Bạn chắc chứ?`,
            activeFn: () => handleStatusChange(id, status)
        });
        onOpen();
    };
    const renderCell = useCallback((quiz: any, columnKey: Key) => {
        const cellValue = quiz[columnKey as keyof any];

        switch (columnKey) {
            // case 'teacher':
            //     return (
            //         <User
            //             avatarProps={{ radius: 'full', size: 'sm', src: 'https://i.pravatar.cc/150?img=4' }}
            //             classNames={{
            //                 description: 'text-default-500'
            //             }}
            //             name={cellValue}
            //         />
            //     );
            case 'subject':
                return getSubjectName(cellValue);
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
            case 'lastUpdateTime':
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
                                disabledKeys={['viewDis', 'enableDis', 'editDis', 'bannedDis']}
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
                                    href={`/admin/exam/${quiz?.id}`}
                                >
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem
                                    key={
                                        quiz?.status === 'ENABLE' || quiz?.status === 'DELETED' ? 'enableDis' : 'enable'
                                    }
                                    color="success"
                                    onClick={() => onActivateOpen(quiz?.id, 'ENABLE')}
                                >
                                    Kích hoạt
                                </DropdownItem>
                                <DropdownItem
                                    key={
                                        quiz?.status === 'DISABLE' ||
                                        quiz?.status === 'BANNED' ||
                                        quiz?.status === 'DELETED'
                                            ? 'bannedDis'
                                            : 'ban'
                                    }
                                    color="danger"
                                    onClick={() =>
                                        onDeactivateOpen(
                                            quiz?.id,
                                            quiz?.examType === 'QUIZ' || quiz?.examType === 'QUIZ_DRAFT'
                                                ? 'BANNED'
                                                : 'DELETED'
                                        )
                                    }
                                >
                                    {quiz?.examType === 'QUIZ' || quiz?.examType === 'QUIZ_DRAFT'
                                        ? 'Cấm'
                                        : 'Vô hiệu hóa'}
                                </DropdownItem>
                                {/* <DropdownItem
                                    key={quiz?.status === 'DISABLE' ? 'bannedDis' : 'ban'}
                                    color="danger"
                                    onClick={() => onDeactivateOpen(quiz?.id)}
                                >
                                    Vô hiệu hóa
                                </DropdownItem> */}
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
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Danh sách câu hỏi ôn tập</h3>
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
                    items={quizzesData || []}
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

export default Quizzes;
