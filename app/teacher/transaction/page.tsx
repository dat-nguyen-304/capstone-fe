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
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
import TableContent from '@/components/table';
import { useQuery } from '@tanstack/react-query';
import { transactionApi } from '@/api-client';
import { transactionStatusColorMap } from '@/utils';
import { Spin } from 'antd';

interface TransactionsProps {}

const columns = [
    { name: 'TÊN KHÓA HỌC', uid: 'courseName', sortable: true },
    { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'HỌC SINH', uid: 'userName', sortable: true },
    { name: 'GIÁ', uid: 'amount' },
    { name: 'TRẠNG THÁI', uid: 'transactionStatus' },
    { name: 'NGÀY', uid: 'paymentDate', sortable: true }
];

const Transaction: React.FC<TransactionsProps> = ({}) => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['courseName', 'subject', 'userName', 'amount', 'transactionStatus', 'paymentDate'])
    );
    const [teacherTransactions, setTeacherTransactions] = useState<[]>([]);
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
            'teacherTransaction',
            {
                page,
                rowsPerPage,
                sort: Array.from(sort)[0] as string
            }
        ],
        queryFn: () =>
            transactionApi.getListTeacherTransaction(
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
            setTeacherTransactions(transactionsData.data);
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
                            : cellValue === 'REFUND_SUCCES'
                            ? 'Hoàn tiền thành công'
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
                    items={teacherTransactions || []}
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
