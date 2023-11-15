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
import { teacherApi, userApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { TeacherType } from '@/types';
import { Spin } from 'antd';
import { useConfirmModal } from '@/hooks';
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
    { name: 'MÔN HỌC', uid: 'subject' },
    { name: 'ĐÃ THAM GIA', uid: 'createdAt', sortable: true },
    { name: 'TRẠNG THÁI', uid: 'status' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const teachers = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        subject: 'Toán Lí',
        createdAt: '02/11/2023',
        status: 'active'
    },
    {
        id: 2,
        name: 'Nguyễn Văn A',
        subject: 'Toán Lí',
        createdAt: '02/11/2023',
        status: 'active'
    },
    {
        id: 3,
        name: 'Nguyễn Văn A',
        subject: 'Toán Lí',
        createdAt: '02/11/2023',
        status: 'active'
    },
    {
        id: 4,
        name: 'Nguyễn Văn A',
        subject: 'Toán Lí',
        createdAt: '02/11/2023',
        status: 'unActive'
    },
    {
        id: 5,
        name: 'Nguyễn Văn A',
        subject: 'Toán Lí',
        createdAt: '02/11/2023',
        status: 'active'
    }
];

type Teacher = (typeof teachers)[0];

const MyQuiz: React.FC<MyQuizProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['id', 'fullName', 'email', 'subject', 'createdAt', 'status', 'action'])
    );
    const [teachers, setTeachers] = useState<TeacherType[]>([]);
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
        data: teachersData,
        isPreviousData
    } = useQuery({
        queryKey: ['teachers', { page, rowsPerPage, statusFilter: Array.from(statusFilter)[0] as string, updateState }],
        queryFn: () => teacherApi.getAll(page - 1, rowsPerPage, Array.from(statusFilter)[0] as string)
    });

    useEffect(() => {
        if (teachersData?.data) {
            setTeachers(teachersData.data);
            setTotalPage(teachersData.totalPage);
            setTotalRow(teachersData.totalRow);
        }
    }, [teachersData]);
    console.log(teachersData);

    const handleStatusChange = async (userId: number, userStatus: string) => {
        try {
            const res = await userApi.changeUserStatus({
                userId,
                userStatus
            });
            if (!res.data.code) {
                if (userStatus == 'ENABLE') {
                    onSuccess({
                        title: 'Duyệt thành công',
                        content: 'Tài khoản đã được kích hoạt thành công'
                    });
                } else if (userStatus == 'DISABLE') {
                    onSuccess({
                        title: 'Đã vô hiệu',
                        content: 'Tài khoản đã được vô hiệu thành công'
                    });
                } else {
                    onSuccess({
                        title: 'Đã cấm',
                        content: 'Tài khoản đã được cấm thành công'
                    });
                }
                setUpdateState(prev => !prev);
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

    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useConfirmModal();

    const onApproveOpen = (id: number, action: string) => {
        if (action == 'ENABLE') {
            onWarning({
                title: 'Xác nhận duyệt',
                content: 'Tài khoản sẽ được hoạt động sau khi được duyệt. Bạn chắc chứ?',
                activeFn: () => handleStatusChange(id, action)
            });
        } else if (action == 'DISABLE') {
            onWarning({
                title: 'Xác nhận duyệt',
                content: 'Tài khoản sẽ được vô hiệu sau khi được duyệt. Bạn chắc chứ?',
                activeFn: () => handleStatusChange(id, action)
            });
        } else {
            onWarning({
                title: 'Xác nhận duyệt',
                content: 'Tài khoản sẽ bị cấm sau khi được duyệt. Bạn chắc chứ?',
                activeFn: () => handleStatusChange(id, action)
            });
        }
        onOpen();
    };

    const renderCell = useCallback((teacher: Teacher, columnKey: Key) => {
        const cellValue = teacher[columnKey as keyof Teacher];

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
            case 'status':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[teacher.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'ENABLE'
                            ? 'Hoạt động'
                            : cellValue === 'WAITTING'
                            ? 'Chờ Xác Thực'
                            : cellValue === 'BANNED'
                            ? 'Tài Khoản Bị Cấm'
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
                                <DropdownItem color="primary" as={Link} href="/teacher/quiz/1">
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem
                                    color="success"
                                    key={teacher.status === 'ENABLE' ? 'enableDis' : 'enable'}
                                    onClick={() => onApproveOpen(teacher?.id, 'ENABLE')}
                                >
                                    Kích Hoạt
                                </DropdownItem>
                                <DropdownItem
                                    color="danger"
                                    key={teacher.status === 'DISABLE' ? 'disableDis' : 'disable'}
                                    onClick={() => onApproveOpen(teacher.id, 'DISABLE')}
                                >
                                    Vô Hiệu Hóa
                                </DropdownItem>
                                <DropdownItem
                                    color="danger"
                                    key={teacher.status === 'BANNED' ? 'bannedDis' : 'banned'}
                                    onClick={() => onApproveOpen(teacher.id, 'BANNED')}
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
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Danh sách giáo viên</h3>
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
                            </select>
                        </label>
                    </div>
                </div>
                <TableContent
                    renderCell={renderCell}
                    headerColumns={headerColumns}
                    items={teachers || []}
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
