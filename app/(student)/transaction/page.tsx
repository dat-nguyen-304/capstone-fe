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
import { useUser } from '@/hooks';
import NotFound from '@/app/not-found';
import { useQuery } from '@tanstack/react-query';
import { transactionApi } from '@/api-client';
import { transactionStatusColorMap } from '@/utils';
import { Spin } from 'antd';

interface TransactionsProps {}

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN KHÓA HỌC', uid: 'courseName', sortable: true },
    { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'GIÁO VIÊN', uid: 'teacherName', sortable: true },
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
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 2,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 3,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 4,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 5,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 6,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    }
];

type Transaction = (typeof transactions)[0];

const Transaction: React.FC<TransactionsProps> = ({}) => {
    const { user } = useUser();
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['id', 'courseName', 'subject', 'teacherName', 'amount', 'paymentDate', 'transactionStatus', 'action'])
    );
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [studentTransactions, setStudentTransactions] = useState<[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
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
                sort: Array.from(sort)[0] as string
            }
        ],
        queryFn: () =>
            transactionApi.getListStudentTransaction(
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
            setStudentTransactions(transactionsData.data);
            setTotalPage(transactionsData.totalPage);
            setTotalRow(transactionsData.totalRow);
        }
    }, [transactionsData]);
    console.log(transactionsData);

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
            // case 'teacher':
            //     return (
            //         <User
            //             avatarProps={{ radius: 'full', size: 'sm', src: 'https://i.pravatar.cc/150?img=4' }}
            //             classNames={{
            //                 description: 'text-default-500'
            //             }}
            //             name={cellValue}
            //         >
            //             {transaction.teacher}
            //         </User>
            //     );
            default:
                return cellValue;
        }
    }, []);

    if (user?.role !== 'STUDENT') return <NotFound />;

    return (
        <div className="w-[90%] xl:w-4/5 mx-auto my-8">
            <h3 className="text-xl font-semibold text-blue-500 mt-4 sm:mt-0">Lịch sử giao dịch</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                <div className="flex flex-col gap-4 mt-8">
                    <div className="sm:flex justify-between gap-3 items-end">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[50%] border-1"
                            placeholder="Tìm kiếm..."
                            color="primary"
                            startContent={<BsSearch className="text-default-300" />}
                            value={filterValue}
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
                    items={studentTransactions || 0}
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
