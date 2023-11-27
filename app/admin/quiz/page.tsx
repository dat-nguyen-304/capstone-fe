'use client';
import { ChangeEvent, Key, useCallback, useMemo, useState } from 'react';
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

interface VideosProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    active: 'success',
    unActive: 'danger',
    updating: 'primary',
    waiting: 'warning'
};

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN QUIZ', uid: 'quizName', sortable: true },
    { name: 'KHÓA HỌC', uid: 'courseName' },
    { name: 'MÔN HỌC', uid: 'subject' },
    { name: 'GIÁO VIÊN', uid: 'teacher' },
    { name: 'SỐ CÂU HỎI', uid: 'numberOfQuestion' },
    { name: 'NGÀY TẠO', uid: 'createdAt', sortable: true },
    { name: 'CẬP NHẬT', uid: 'updatedAt', sortable: true },
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
            'id',
            'quizName',
            'courseName',
            'teacher',
            'subject',
            'numberOfQuestion',
            'createdAt',
            'updatedAt',
            'status',
            'action'
        ])
    );
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['active', 'unActive']));

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
    const renderCell = useCallback((quiz: Quiz, columnKey: Key) => {
        const cellValue = quiz[columnKey as keyof Quiz];

        switch (columnKey) {
            case 'teacher':
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
                let statusName = '';
                if (cellValue === 'active') statusName = 'Hoạt động';
                else if (cellValue === 'unActive') statusName = 'Vô hiệu';
                else if (cellValue === 'updating') statusName = 'Chờ cập nhật';
                else if (cellValue === 'waiting') statusName = 'Chờ phê duyệt';

                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[quiz.status]}
                        size="sm"
                        variant="dot"
                    >
                        {statusName}
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
                                <DropdownItem as={Link} href="/teacher/quiz/1">
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem>Vô hiệu hóa</DropdownItem>
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
            <div className="flex flex-col gap-4 mt-8">
                <div className="sm:flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[50%] border-1"
                        placeholder="Tìm kiếm..."
                        size="sm"
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
                                    Trạng thái
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                <DropdownItem key="active" className="capitalize">
                                    {capitalize('hoạt động')}
                                </DropdownItem>
                                <DropdownItem key="unActive" className="capitalize">
                                    {capitalize('vô hiệu hóa')}
                                </DropdownItem>
                                <DropdownItem key="updating" className="capitalize">
                                    {capitalize('Chờ cập nhật')}
                                </DropdownItem>
                                <DropdownItem key="waiting" className="capitalize">
                                    {capitalize('Chờ phê duyệt')}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="flex">
                                <Button endContent={<BsChevronDown className="text-small" />} size="sm" variant="flat">
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
                    <span className="text-default-400 text-xs sm:text-sm">Tìm thấy {quizzes.length} kết quả</span>
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
                totalPage={2}
            />
        </div>
    );
};

export default Quizzes;
