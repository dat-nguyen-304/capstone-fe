'use client';

import { ChangeEvent, Key, useCallback, useMemo, useState } from 'react';
import {
    Button,
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
import { useUser } from '@/hooks';
import NotFound from '../not-found';

interface TransactionsProps {}

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN KHÓA HỌC', uid: 'name', sortable: true },
    { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'GIÁO VIÊN', uid: 'teacher', sortable: true },
    { name: 'THÀNH TIỀN', uid: 'price' },
    { name: 'NGÀY', uid: 'date', sortable: true }
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
        new Set(['id', 'name', 'subject', 'teacher', 'price', 'date'])
    );
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});

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

    const renderCell = useCallback((transaction: Transaction, columnKey: Key) => {
        const cellValue = transaction[columnKey as keyof Transaction];

        switch (columnKey) {
            case 'name':
                return <Link href={`/course/${1}`}>{cellValue}</Link>;
            case 'price':
                return cellValue.toLocaleString('vi-VN');
            case 'teacher':
                return (
                    <User
                        avatarProps={{ radius: 'full', size: 'sm', src: 'https://i.pravatar.cc/150?img=4' }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    >
                        {transaction.teacher}
                    </User>
                );
            default:
                return cellValue;
        }
    }, []);

    if (user?.role !== 'STUDENT') return <NotFound />;

    return (
        <div className="w-[90%] xl:w-4/5 mx-auto my-8">
            <div className="flex flex-col gap-4">
                <div className="sm:flex justify-between gap-3 items-end">
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
                    <div className="flex gap-3 mt-4 sm:mt-0">
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
                    <span className="text-default-400 text-xs sm:text-sm">Tìm thấy {transactions.length} kết quả</span>
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
                items={transactions}
                page={page}
                setPage={setPage}
                sortDescriptor={sortDescriptor}
                setSortDescriptor={setSortDescriptor}
                totalPage={2}
            />
        </div>
    );
};

export default Transaction;
