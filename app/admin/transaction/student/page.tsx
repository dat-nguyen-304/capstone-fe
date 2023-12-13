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
import { useCustomModal, useInputModal, useInputModalRefund, useSelectedSidebar } from '@/hooks';
import { toast } from 'react-toastify';
import { InputModal } from '@/components/modal/InputModal';
import { InputModalRefund } from '@/components/modal/InputModalRefund';

interface StudentTransactionsProps {}

const columns = [
    { name: 'TÊN KHÓA HỌC', uid: 'courseName', sortable: false },
    { name: 'MÔN HỌC', uid: 'subject', sortable: false },
    { name: 'GIÁO VIÊN', uid: 'teacherName', sortable: false },
    { name: 'HỌC SINH', uid: 'userName', sortable: false },
    { name: 'GIÁ KHÓA HỌC', uid: 'amount' },
    { name: 'TRẠNG THÁI', uid: 'transactionStatus', sortable: false },
    { name: 'NGÀY', uid: 'paymentDate', sortable: false },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const StudentTransaction: React.FC<StudentTransactionsProps> = ({}) => {
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
    const [declineId, setDeclineId] = useState<number>();
    const {
        status,
        error,
        data: transactionsData,
        isPreviousData,
        refetch
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
                'REFUND',
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
    const { onAdminKeys } = useSelectedSidebar();

    useEffect(() => {
        onAdminKeys(['14']);
    }, []);
    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    const {
        onOpen: onInputOpen,
        onClose: onInputClose,
        onReason,
        reason,
        transactionCode,
        onTransactionCode
    } = useInputModalRefund();
    const { onOpen: onInputDeclineOpen, onClose: onInputDeclineClose, onDescription, description } = useInputModal();

    const handlePaymentTeacher = async (id: number, verifyStatus: string) => {
        let toastLoading;

        try {
            onClose();

            toastLoading = toast.loading('Đang xử lí yêu cầu');
            if (verifyStatus == 'ACCEPTED') {
                onInputClose();
                const res = await transactionApi.adminRefund({
                    id,
                    reason: reason,
                    transactionCode: transactionCode,
                    verifyStatus: verifyStatus
                });
                if (res) {
                    toast.success('Xác nhận hoàn tiền đã gửi thành công tới người dùng');

                    refetch();
                }
            } else {
                onInputDeclineClose();
                const res = await transactionApi.adminRefund({
                    id,
                    reason: description,
                    transactionCode: '',
                    verifyStatus: verifyStatus
                });
                if (res) {
                    toast.success('Từ chối hoàn tiền đã gửi thành công tới người dùng');

                    refetch();
                }
            }

            onReason?.('');
            onTransactionCode?.('');
            toast.dismiss(toastLoading);
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error changing user status', error);
        }
    };
    const onRefundOpen = (id: number) => {
        onWarning({
            title: 'Xác nhận hoàn tiền',
            content: 'Đơn hoàn tiền sẽ được xác nhận. Bạn chắc chứ?',
            activeFn: () => {
                onClose();
                onInputOpen();
            }
        });
        setDeclineId(id);
        onOpen();
    };
    const onDeclineRefundOpen = (id: number) => {
        onWarning({
            title: 'Xác nhận từ chối hoàn tiền',
            content: 'Bạn sẽ từ chối đơn hoàn tiền của học sinh. Bạn chắc chứ?',
            activeFn: () => {
                onClose();
                onInputDeclineOpen();
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
                                <DropdownItem color="success" onClick={() => onRefundOpen(transaction?.id)}>
                                    Duyệt
                                </DropdownItem>
                                <DropdownItem color="danger" onClick={() => onDeclineRefundOpen(transaction?.id)}>
                                    Từ chối
                                </DropdownItem>
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
                        {cellValue === 'REFUND_SUCCESS'
                            ? 'Hoàn tiền thành công'
                            : cellValue === 'PENDING'
                            ? 'Đang chờ'
                            : cellValue === 'REFUND'
                            ? 'Chờ hoàn tiền'
                            : cellValue === 'REJECT_REFUND'
                            ? 'Hoàn tiền thất bại'
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
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Xử lý hoàn tiền học sinh</h3>
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
            <InputModal activeFn={() => handlePaymentTeacher(declineId as number, 'REJECT')} />
            <InputModalRefund activeFn={() => handlePaymentTeacher(declineId as number, 'ACCEPTED')} />
        </div>
    );
};

export default StudentTransaction;
