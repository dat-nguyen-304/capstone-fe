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
import { teacherIncomeApi, transactionApi } from '@/api-client';
import { transactionStatusColorMap } from '@/utils';
import { Spin } from 'antd';
import { useCustomModal, useInputModalNumber, useSelectedSidebar } from '@/hooks';
import { toast } from 'react-toastify';
import { InputModalNumber } from '@/components/modal/InputModalNumber';

interface TeacherTransactionsProps {}

const columns = [
    { name: 'TÊN KHÓA HỌC', uid: 'courseName', sortable: false },
    // { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'GIÁO VIÊN', uid: 'teacherName', sortable: false },
    { name: 'DOANH THU', uid: 'revenue' },
    { name: 'TIỀN NHẬN', uid: 'receivedMoney' },
    { name: 'TRẠNG THÁI', uid: 'teacherIncomeStatus', sortable: false },
    { name: 'NGÀY TẠO', uid: 'monthOfYear', sortable: false },
    { name: 'NGÀY THANH TOÁN', uid: 'paymentDate', sortable: false },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const TeacherTransaction: React.FC<TeacherTransactionsProps> = ({}) => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set([
            'courseName',
            'teacherName',
            'revenue',
            'receivedMoney',
            'teacherIncomeStatus',
            'monthOfYear',
            'paymentDate',
            'action'
        ])
    );
    const [teacherIncome, setTeacherIncome] = useState<[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [sort, setSort] = useState<Selection>(new Set(['ALL']));
    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    const {
        onOpen: onInputOpen,
        onClose: onInputClose,
        onMoney,
        money,
        transactionCode,
        onTransactionCode
    } = useInputModalNumber();
    const [declineId, setDeclineId] = useState<number>();
    const {
        status,
        error,
        data: transactionsData,
        isPreviousData,
        refetch
    } = useQuery({
        queryKey: [
            'adminTeacherIncome',
            {
                page,
                rowsPerPage,
                statusFilter: Array.from(statusFilter)[0] as string,
                sort: Array.from(sort)[0] as string
            }
        ],
        queryFn: () =>
            teacherIncomeApi.getTeacherIncomeForAdmin(
                (Array.from(statusFilter)[0] as string) == 'ALL' ? '' : (Array.from(statusFilter)[0] as string),
                page - 1,
                rowsPerPage,
                (Array.from(sort)[0] as string) == 'DateDesc' || (Array.from(sort)[0] as string) == 'DateAsc'
                    ? 'paymentDate'
                    : (Array.from(sort)[0] as string) == 'PriceDesc' || (Array.from(sort)[0] as string) == 'PriceAsc'
                    ? 'revenue'
                    : 'id',
                (Array.from(sort)[0] as string) == 'DateDesc' || (Array.from(sort)[0] as string) == 'PriceDesc'
                    ? 'DESC'
                    : 'ASC'
            )
    });

    useEffect(() => {
        if (transactionsData?.data) {
            setTeacherIncome(transactionsData.data);
            setTotalPage(transactionsData.totalPage);
            setTotalRow(transactionsData.totalRow);
        }
    }, [transactionsData]);
    const { onAdminKeys } = useSelectedSidebar();

    useEffect(() => {
        onAdminKeys(['13']);
    }, []);
    const handlePaymentTeacher = async (id: number) => {
        let toastLoading;

        const paymentDate = new Date();
        paymentDate.setHours(paymentDate.getHours() + 7);
        try {
            onClose();
            onInputClose();
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            const res = await teacherIncomeApi.adminPaymentTeacher({
                id,
                paymentCode: transactionCode,
                paymentDate: paymentDate,
                amount: money
            });

            if (res) {
                toast.success('Số tiền đã gửi cho giáo viên thành công');

                refetch();
            }
            onMoney?.(Number(0));
            onTransactionCode?.('');
            toast.dismiss(toastLoading);
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error changing user status', error);
        }
    };
    const onPaymentOpen = (id: number) => {
        onWarning({
            title: 'Xác nhận chuyển tiền',
            content: 'Số tiền của bạn sẽ được gửi tới giáo viên. Bạn chắc chứ?',
            activeFn: () => {
                onClose();
                onInputOpen();
            }
        });
        setDeclineId(id);
        onOpen();
    };

    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, sort]);

    const renderCell = useCallback((transaction: any, columnKey: Key) => {
        const cellValue = transaction[columnKey as keyof any];

        switch (columnKey) {
            case 'teacherName':
                return (
                    <User
                        avatarProps={{
                            radius: 'full',
                            size: 'sm',
                            src: transaction?.teacherAvatar
                                ? transaction?.teacherAvatar
                                : 'https://i.pravatar.cc/150?img=4'
                        }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    />
                );
            case 'revenue':
                const changePrice = Number(cellValue) / 100;

                return changePrice?.toLocaleString('vi-VN');
            case 'receivedMoney':
                const changePriceRecived = Number(cellValue) / 100;

                return changePriceRecived?.toLocaleString('vi-VN');
            case 'action':
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <BsThreeDotsVertical className="text-default-400" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Options" disabledKeys={['paymentDis']}>
                                <DropdownItem
                                    color="success"
                                    key={transaction?.teacherIncomeStatus === 'RECEIVED' ? 'paymentDis' : 'payment'}
                                    onClick={() => onPaymentOpen(transaction?.id)}
                                >
                                    Chuyển tiền
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case 'teacherIncomeStatus':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={transactionStatusColorMap[transaction?.teacherIncomeStatus]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'RECEIVED'
                            ? 'Chuyển tiền thành công'
                            : cellValue === 'PENDING'
                            ? 'Đang chờ'
                            : cellValue === 'NOTYET'
                            ? 'Chưa được'
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

                return cellValue ? formattedDate : '';
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Lịch sử giao dịch giáo viên</h3>
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
                                    <DropdownItem key="RECEIVED" className="capitalize">
                                        {capitalize('Chuyển tiền thành Công')}
                                    </DropdownItem>
                                    <DropdownItem key="PENDING" className="capitalize">
                                        {capitalize('Đang chờ')}
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
                                        {capitalize('Doanh thu cao nhất')}
                                    </DropdownItem>
                                    <DropdownItem key="PriceAsc" className="capitalize">
                                        {capitalize('Doanh thu thấp nhất')}
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
                    items={teacherIncome}
                    page={page}
                    setPage={setPage}
                    sortDescriptor={sortDescriptor}
                    setSortDescriptor={setSortDescriptor}
                    totalPage={totalPage || 1}
                />
            </Spin>
            <InputModalNumber activeFn={() => handlePaymentTeacher(declineId as number)} />
        </div>
    );
};

export default TeacherTransaction;
