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
import { reportVideoApi, studentApi, userApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { useCustomModal, useInputModal } from '@/hooks';
import { StudentType } from '@/types';
import { toast } from 'react-toastify';
import { InputModal } from '@/components/modal/InputModal';
interface ReportsProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    ENABLE: 'success',
    WAITTING: 'primary',
    DISABLE: 'danger',
    BANNED: 'danger'
};

function getTypeName(type: string) {
    const reportTy: { [key: string]: string | null } = {
        INTEGRITY: 'Vi phạm chuẩn mực',
        POLICY: 'Vi phạm chính sách',
        ACADEMIC: 'Lỗi học thuật',
        TECHNICAL: 'Lỗi kĩ thuật',
        OPINION: 'Góp ý',
        OTHERS: 'Khác'
    };

    return reportTy[type] || null;
}

const columns = [
    // { name: 'ID', uid: 'id', sortable: true },
    { name: 'NGƯỜI BÁO CÁO', uid: 'userName', sortable: true },
    { name: 'LOẠI BÁO CÁO', uid: 'reportType', sortable: true },
    { name: 'NỘI DUNG VI PHẠM', uid: 'objectName', sortable: true },
    { name: 'MÔ TẢ', uid: 'reportContent' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const Reports: React.FC<ReportsProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [updateState, setUpdateState] = useState<Boolean>(false);
    const visibleColumns = new Set(['userName', 'reportType', 'objectName', 'reportContent', 'action']);
    const headerColumns = columns.filter(column => Array.from(visibleColumns).includes(column.uid));
    const [declineId, setDeclineId] = useState<number>();
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
    const [reportVideo, setReportVideo] = useState<any[]>([]);
    const {
        status,
        error,
        data: reportVideosData,
        isPreviousData
    } = useQuery({
        queryKey: ['reportExams', { page, rowsPerPage, updateState }],
        queryFn: () => reportVideoApi.reportsVideo(page - 1, rowsPerPage, 'reportId', 'ASC')
    });

    useEffect(() => {
        if (reportVideosData?.data) {
            // const updatedReportVideo = reportVideosData.data.map((item: any) => ({
            //     ...item,
            //     key: item.reportId.toString()
            // }));
            setReportVideo(reportVideosData?.data);
            setTotalPage(reportVideosData.totalPage);
            setTotalRow(reportVideosData.totalRow);
        }
    }, [reportVideosData]);

    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    const { onOpen: onInputOpen, onClose: onInputClose, onDescription, description } = useInputModal();
    const handleStatusChange = async (id: number, verifyStatus: string) => {
        let toastLoading;
        console.log({ description, id, verifyStatus });
        try {
            onClose();
            onInputClose();
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            const res = await reportVideoApi.verifyReportContent({
                id,
                reason: description,
                verifyStatus
            });

            if (!res.data.code) {
                if (verifyStatus == 'ACCEPTED') {
                    toast.success('Nội dung báo cáo đã được duyệt thành công');
                } else if (verifyStatus == 'REJECT') {
                    toast.success('Nội dung báo cáo đã từ chối thành công');
                }
                toast.dismiss(toastLoading);
                setUpdateState(prev => !prev);
            }
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error changing user status', error);
        }
    };

    const onApproveOpen = (id: number) => {
        onWarning({
            title: 'Xác nhận duyệt',
            content: 'Nội dung sẽ được duyệt. Bạn chắc chứ?',
            activeFn: () => handleStatusChange(id, 'ACCEPTED')
        });
        onOpen();
    };

    const onDeclineOpen = (id: number) => {
        onDanger({
            title: 'Xác nhận từ chối',
            content: 'Nội dung không hiển thị sau khi đã từ chối. Bạn chắc chứ?',
            activeFn: () => {
                onClose();
                onInputOpen();
            }
        });
        setDeclineId(id);
        onOpen();
    };

    const renderCell = useCallback((student: any, columnKey: Key) => {
        const cellValue = student[columnKey as keyof any];

        switch (columnKey) {
            case 'userName':
                return (
                    <User
                        avatarProps={{
                            radius: 'full',
                            size: 'sm',
                            src: student?.userAvatar ? student?.userAvatar : 'https://i.pravatar.cc/150?img=4'
                        }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    />
                );
            case 'reportType':
                return getTypeName(cellValue);
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
                                <DropdownItem color="primary" as={Link} href={`/admin/video/${student?.objectId}`}>
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem color="success" onClick={() => onApproveOpen(student?.id)}>
                                    Duyệt
                                </DropdownItem>
                                <DropdownItem color="danger" onClick={() => onDeclineOpen(student?.id)}>
                                    Từ chối
                                </DropdownItem>
                                <DropdownItem color="danger" onClick={() => {}}>
                                    Ban Người Dùng
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
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Danh sách báo cáo video</h3>
            {/* <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải"> */}
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
                items={reportVideo || []}
                page={page}
                setPage={setPage}
                sortDescriptor={sortDescriptor}
                setSortDescriptor={setSortDescriptor}
                totalPage={totalPage || 1}
            />
            {/* </Spin> */}
            <InputModal activeFn={() => handleStatusChange(declineId as number, 'REJECT')} />
        </div>
    );
};

export default Reports;
