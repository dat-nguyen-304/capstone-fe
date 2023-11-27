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
import { Spin } from 'antd';
import { useCustomModal } from '@/hooks';
import { StudentType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { discussionApi } from '@/api-client';
import Image from 'next/image';
interface ReportsProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    ENABLE: 'success',
    WAITTING: 'primary',
    DISABLE: 'danger',
    BANNED: 'danger'
};

const reports = [
    {
        id: 1,
        reportType: 'Lỗi kĩ thuật',
        contentType: 'video',
        title: 'hello',
        description: 'abc'
    },
    {
        id: 2,
        reportType: 'Lỗi học thuật',
        contentType: 'video',
        title: 'hello',
        description: 'abc'
    },
    {
        id: 3,
        reportType: 'Vi phạm chuẩn mực',
        contentType: 'video',
        title: 'hello',
        description: 'abc'
    }
];

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'LOẠI BÁO CÁO', uid: 'type', sortable: true },
    { name: 'NỘI DUNG VI PHẠM', uid: 'reportMsg', sortable: true },
    { name: 'NGƯỜI BÁO CÁO', uid: 'ownerFullName', sortable: true },
    { name: 'HÌNH ẢNH', uid: 'imageUrl' },
    // { name: 'MÔ TẢ', uid: 'description' },
    // { name: 'CHỦ ĐỀ', uid: 'title' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

function getTypeName(type: string) {
    const reportTy: { [key: string]: string | null } = {
        INTEGRITY: 'Vi phạm chuẩn mực',
        ACADEMIC: 'Lỗi học thuật',
        TECHNICAL: 'Lỗi kĩ thuật',
        OPINION: 'Góp ý',
        OTHERS: 'Khác'
    };

    return reportTy[type] || null;
}

const Reports: React.FC<ReportsProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const visibleColumns = new Set(['id', 'type', 'reportMsg', 'ownerFullName', 'imageUrl', 'action']);
    const headerColumns = columns.filter(column => Array.from(visibleColumns).includes(column.uid));
    const [reportDiscussions, setReportDiscussions] = useState<any[]>([]);
    const {
        status,
        error,
        data: reportDiscussionsData,
        isPreviousData
    } = useQuery({
        queryKey: ['reportDiscussions', { page, rowsPerPage, statusFilter: Array.from(statusFilter)[0] as string }],
        queryFn: () =>
            discussionApi.getListReportConversation(
                Array.from(statusFilter)[0] === 'ALL' ? '' : (Array.from(statusFilter)[0] as string),
                page - 1,
                rowsPerPage,
                'id',
                'ASC'
            )
    });

    useEffect(() => {
        if (reportDiscussionsData?.data) {
            setReportDiscussions(reportDiscussionsData.data);
            setTotalPage(reportDiscussionsData.totalPage);
            setTotalRow(reportDiscussionsData.totalRow);
        }
    }, [reportDiscussionsData]);

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

    const renderCell = useCallback((student: any, columnKey: Key) => {
        const cellValue = student[columnKey as keyof any];

        switch (columnKey) {
            case 'type':
                return getTypeName(cellValue);
            case 'imageUrl':
                // Use a default image URL if the imageUrl is null or empty
                const imageUrl = cellValue || 'URL_OF_YOUR_DEFAULT_IMAGE';
                return (
                    <User
                        avatarProps={{
                            radius: 'full',
                            size: 'sm',
                            src: imageUrl ? imageUrl : 'https://i.pravatar.cc/150?img=4'
                        }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={''}
                    />
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
                                <DropdownItem color="primary">Xem chi tiết</DropdownItem>
                                <DropdownItem
                                    color="success"
                                    key={student?.userStatus === 'ENABLE' ? 'enableDis' : 'enable'}
                                    onClick={() => {}}
                                >
                                    Kích Hoạt
                                </DropdownItem>
                                <DropdownItem
                                    color="danger"
                                    key={student?.userStatus === 'DISABLE' ? 'disableDis' : 'disable'}
                                    onClick={() => {}}
                                >
                                    Vô Hiệu Hóa
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
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Danh sách báo cáo</h3>
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
                                        Loại báo cáo
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
                                    <DropdownItem key="INTEGRITY" className="capitalize">
                                        {capitalize('Vi phạm chuẩn mực')}
                                    </DropdownItem>
                                    <DropdownItem key="ACADEMIC" className="capitalize">
                                        {capitalize('Lỗi học thuật')}
                                    </DropdownItem>
                                    <DropdownItem key="TECHNICAL" className="capitalize">
                                        {capitalize('Lỗi kĩ thuật')}
                                    </DropdownItem>
                                    <DropdownItem key="OPINION" className="capitalize">
                                        {capitalize('Góp ý')}
                                    </DropdownItem>
                                    <DropdownItem key="OTHERS" className="capitalize">
                                        {capitalize('Khác')}
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
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                        </label>
                    </div>
                </div>
                <TableContent
                    renderCell={renderCell}
                    headerColumns={headerColumns}
                    items={reportDiscussions || []}
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

export default Reports;
