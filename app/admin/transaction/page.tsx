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
    Select,
    SelectItem,
    Selection,
    SortDescriptor,
    User
} from '@nextui-org/react';
import Link from 'next/link';
import { BsChevronDown, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
import TableContent from '@/components/table';
import { useQuery } from '@tanstack/react-query';
import { transactionApi } from '@/api-client';
import { transactionStatusColorMap } from '@/utils';
import { Spin } from 'antd';

interface TransactionsProps {}

const columns = [
    // { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN KHÓA HỌC', uid: 'courseName', sortable: true },
    { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'GIÁO VIÊN', uid: 'teacherName', sortable: true },
    { name: 'HỌC SINH', uid: 'userName', sortable: true },
    { name: 'GIÁ KHÓA HỌC', uid: 'amount' },
    { name: 'NGÀY', uid: 'paymentDate', sortable: true },
    { name: 'TRẠNG THÁI', uid: 'transactionStatus', sortable: true },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const transactions = [
    {
        id: 1,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        student: 'Nguyễn Văn An',
        teacher: 'Nguyễn Văn Bê',
        coursePrice: 500000,
        revenue: 50000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 2,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        student: 'Nguyễn Văn An',
        teacher: 'Nguyễn Văn Bê',
        coursePrice: 500000,
        revenue: 50000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 3,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        student: 'Nguyễn Văn An',
        teacher: 'Nguyễn Văn Bê',
        coursePrice: 500000,
        revenue: 50000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 4,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        student: 'Nguyễn Văn An',
        teacher: 'Nguyễn Văn Bê',
        coursePrice: 500000,
        revenue: 50000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 5,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        student: 'Nguyễn Văn An',
        teacher: 'Nguyễn Văn Bê',
        coursePrice: 500000,
        revenue: 50000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 6,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        student: 'Nguyễn Văn An',
        teacher: 'Nguyễn Văn Bê',
        coursePrice: 500000,
        revenue: 50000,
        date: '12/12/2023 08:02:02'
    }
];

type Transaction = (typeof transactions)[0];

const Transaction: React.FC<TransactionsProps> = ({}) => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set([
            'courseName',
            'subject',
            'teacherName',
            'userName',
            'amount',
            'paymentDate',
            'transactionStatus',
            'action'
        ])
    );
    const [adminTransactions, setAdminTransactions] = useState<[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [sort, setSort] = useState<Selection>(new Set(['ALL']));

    const {
        status,
        error,
        data: transactionsData,
        isPreviousData
    } = useQuery({
        queryKey: [
            'adminTransaction',
            {
                page,
                rowsPerPage,
                statusFilter: Array.from(statusFilter)[0] as string,
                sort: Array.from(sort)[0] as string
            }
        ],
        queryFn: () =>
            transactionApi.getListAdminTransaction(
                (Array.from(statusFilter)[0] as string) == 'ALL' ? '' : (Array.from(statusFilter)[0] as string),
                page - 1,
                rowsPerPage,
                (Array.from(sort)[0] as string) == 'DateDesc' || (Array.from(sort)[0] as string) == 'DateAsc'
                    ? 'paymentDate'
                    : (Array.from(sort)[0] as string) == 'PriceDesc' || (Array.from(sort)[0] as string) == 'PriceAsc'
                    ? 'amount'
                    : 'id',
                (Array.from(sort)[0] as string) == 'DateDesc' || (Array.from(sort)[0] as string) == 'PriceDesc'
                    ? 'DESC'
                    : 'ASC'
            )
    });

    useEffect(() => {
        if (transactionsData?.data) {
            setAdminTransactions(transactionsData.data);
            setTotalPage(transactionsData.totalPage);
            setTotalRow(transactionsData.totalRow);
        }
    }, [transactionsData]);

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

    const renderCell = useCallback((transaction: any, columnKey: Key) => {
        const cellValue = transaction[columnKey as keyof any];

        switch (columnKey) {
            case 'amount':
                const changePrice = Number(cellValue) / 100;
                return changePrice?.toLocaleString('vi-VN');
            case 'teacherName':
                return (
                    <User
                        avatarProps={{
                            radius: 'full',
                            size: 'sm',
                            src: transaction.teacherAvatar
                                ? transaction.teacherAvatar
                                : 'https://i.pravatar.cc/150?img=4'
                        }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    >
                        {transaction.teacherName}
                    </User>
                );
            case 'userName':
                return (
                    <User
                        avatarProps={{
                            radius: 'full',
                            size: 'sm',
                            src: transaction.userAvatar ? transaction.userAvatar : 'https://i.pravatar.cc/150?img=4'
                        }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    >
                        {transaction.userAvatar}
                    </User>
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
                                <DropdownItem color="success">Duyệt</DropdownItem>
                                <DropdownItem color="danger">Từ chối</DropdownItem>
                                <DropdownItem color="primary">Xem chi tiết</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case 'transactionStatus':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={transactionStatusColorMap[transaction.transactionStatus]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'SUCCESS'
                            ? 'Thành công'
                            : cellValue === 'PENDING'
                            ? 'Đang chờ'
                            : cellValue === 'FAIL'
                            ? 'Thất bại'
                            : cellValue === 'RECEIVED'
                            ? 'Chuyển tiền thành công'
                            : cellValue === 'REFUND_SUCCES'
                            ? 'Hoàn tiền thành công'
                            : cellValue === 'REFUND'
                            ? 'Chờ hoàn tiền'
                            : cellValue === 'REJECT_REFUND'
                            ? 'Từ chối hoàn tiền'
                            : cellValue === 'NOTYET'
                            ? 'Chưa chuyển'
                            : 'Vô hiệu'}
                    </Chip>
                );
            case 'paymentDate':
                const dateValue = cellValue ? new Date(cellValue) : new Date();

                const formattedDate = new Intl.DateTimeFormat('en-GB', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: false
                })?.format(dateValue);

                return formattedDate;
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Lịch sử giao dịch</h3>
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
                                    <DropdownItem key="SUCCESS" className="capitalize">
                                        {capitalize('Thành Công')}
                                    </DropdownItem>
                                    <DropdownItem key="RECEIVED" className="capitalize">
                                        {capitalize('Chuyển tiền thành Công')}
                                    </DropdownItem>
                                    <DropdownItem key="REFUND_SUCCES" className="capitalize">
                                        {capitalize('Hoàn tiền thành Công')}
                                    </DropdownItem>
                                    <DropdownItem key="PENDING" className="capitalize">
                                        {capitalize('Đang chờ')}
                                    </DropdownItem>
                                    <DropdownItem key="REFUND" className="capitalize">
                                        {capitalize('Chờ hoàn tiền')}
                                    </DropdownItem>
                                    <DropdownItem key="REJECT_REFUND" className="capitalize">
                                        {capitalize('Từ chối hoàn tiền')}
                                    </DropdownItem>
                                    <DropdownItem key="NOTYET" className="capitalize">
                                        {capitalize('Chưa được')}
                                    </DropdownItem>
                                    <DropdownItem key="FAIL" className="capitalize">
                                        {capitalize('Thất Bại')}
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
                                        Sắp xếp
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={sort}
                                    selectionMode="single"
                                    onSelectionChange={setSort}
                                >
                                    <DropdownItem key="ALL" className="capitalize">
                                        {capitalize('Tất Cả')}
                                    </DropdownItem>
                                    <DropdownItem key="DateDesc" className="capitalize">
                                        {capitalize('Mới nhất')}
                                    </DropdownItem>
                                    <DropdownItem key="DateAsc" className="capitalize">
                                        {capitalize('Cũ nhất')}
                                    </DropdownItem>
                                    <DropdownItem key="PriceDesc" className="capitalize">
                                        {capitalize('Giá cao nhất')}
                                    </DropdownItem>
                                    <DropdownItem key="PriceAsc" className="capitalize">
                                        {capitalize('Giá thấp nhất')}
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
                    items={adminTransactions}
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

export default Transaction;
