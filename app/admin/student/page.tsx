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
import { studentApi, userApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
interface MyQuizProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    ENABLE: 'success',
    WAITTING: 'primary',
    DISABLE: 'danger',
    BANNED: 'danger'
};

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TIÊU ĐỀ', uid: 'fullName', sortable: true },
    { name: 'Email', uid: 'email', sortable: true },
    // { name: 'TỔ HỢP MÔN', uid: 'targets?.[0]?.name' },
    // { name: 'ĐÃ THAM GIA', uid: 'createdAt', sortable: true },
    { name: 'TRẠNG THÁI', uid: 'userStatus' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const students = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        combination: 'A00 A01',
        createdAt: '02/11/2023',
        userStatus: 'active'
    },
    {
        id: 2,
        name: 'Nguyễn Văn A',
        combination: 'A00 A01',
        createdAt: '02/11/2023',
        userStatus: 'active'
    },
    {
        id: 3,
        name: 'Nguyễn Văn A',
        combination: 'A00 A01',
        createdAt: '02/11/2023',
        userStatus: 'active'
    },
    {
        id: 4,
        name: 'Nguyễn Văn A',
        combination: 'A00 A01',
        createdAt: '02/11/2023',
        userStatus: 'unActive'
    },
    {
        id: 5,
        name: 'Nguyễn Văn A',
        combination: 'A00 A01',
        createdAt: '02/11/2023',
        userStatus: 'active'
    }
];

type Student = (typeof students)[0];

const MyQuiz: React.FC<MyQuizProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        // new Set(['id', 'fullName', 'email', 'targets?.[0]?.name', 'createdAt', 'userStatus', 'action'])
        new Set(['id', 'fullName', 'email', 'userStatus', 'action'])
    );
    const [students, setStudents] = useState<Student[]>([]);
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
        data: studentsData,
        isPreviousData
    } = useQuery({
        queryKey: ['students', { page, rowsPerPage, statusFilter: Array.from(statusFilter)[0] as string, updateState }],
        queryFn: () => studentApi.getAll(page - 1, rowsPerPage, Array.from(statusFilter)[0] as string)
    });

    useEffect(() => {
        if (studentsData?.data) {
            setStudents(studentsData.data);
            setTotalPage(studentsData.totalPage);
            setTotalRow(studentsData.totalRow);
        }
    }, [studentsData]);

    const handleStatusChange = async (userId: number, userStatus: string) => {
        try {
            const res = await userApi.changeUserStatus({
                userId,
                userStatus
            });
            if (!res.data.code) {
                setUpdateState(prev => !prev);
            }
        } catch (error) {
            // Handle error
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
    const renderCell = useCallback((student: Student, columnKey: Key) => {
        const cellValue = student[columnKey as keyof Student];

        switch (columnKey) {
            case 'fullName':
                return (
                    <User
                        avatarProps={{ radius: 'full', size: 'sm', src: 'https://i.pravatar.cc/150?img=4' }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    />
                );
            case 'userStatus':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[student?.userStatus]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'ENABLE'
                            ? 'Hoạt động'
                            : cellValue === 'WAITTING'
                            ? 'Chờ Xác Thực'
                            : cellValue === 'BANNED'
                            ? 'Bị Cấm'
                            : 'Vô Hiệu'}
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
                            <DropdownMenu aria-label="Options" disabledKeys={['enableDis', 'disableDis', 'bannedDis']}>
                                <DropdownItem as={Link} href="/teacher/quiz/1">
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem
                                    key={student?.userStatus === 'ENABLE' ? 'enableDis' : 'enable'}
                                    onClick={() => handleStatusChange(student.id, 'ENABLE')}
                                >
                                    Kích Hoạt
                                </DropdownItem>
                                <DropdownItem
                                    key={student?.userStatus === 'DISABLE' ? 'disableDis' : 'disable'}
                                    onClick={() => handleStatusChange(student.id, 'DISABLE')}
                                >
                                    Vô Hiệu Hóa
                                </DropdownItem>
                                <DropdownItem
                                    key={student?.userStatus === 'BANNED' ? 'bannedDis' : 'banned'}
                                    onClick={() => handleStatusChange(student.id, 'BANNED')}
                                >
                                    Cấm
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
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Danh sách học sinh</h3>
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
                                        Trạng Thái
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
                                    <DropdownItem key="ENABLE" className="capitalize">
                                        {capitalize('Hoạt Động')}
                                    </DropdownItem>
                                    <DropdownItem key="WAITTING" className="capitalize">
                                        {capitalize('Đợi Xác Thực')}
                                    </DropdownItem>
                                    <DropdownItem key="DISABLE" className="capitalize">
                                        {capitalize('Vô Hiệu')}
                                    </DropdownItem>
                                    <DropdownItem key="BANNED" className="capitalize">
                                        {capitalize('Tài Khoản Bị Cấm')}
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
                    items={students || []}
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
