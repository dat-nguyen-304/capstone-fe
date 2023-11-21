'use client';

import { ChangeEvent, Key, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Button,
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
import { useCustomModal } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { videoApi } from '@/api-client';
import { VideoCardType } from '@/types';
import { Spin } from 'antd';

interface VideosProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    AVAILABLE: 'success',
    BANNED: 'danger',
    WAITING: 'primary',
    UNAVAILABLE: 'warning'
};
const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN VIDEO', uid: 'name', sortable: true },
    { name: 'KHÓA HỌC', uid: 'courseName' },
    { name: 'MÔN HỌC', uid: 'subject' },
    { name: 'GIÁO VIÊN', uid: 'teacher' },
    { name: 'NGÀY TẠO', uid: 'createdDate', sortable: true },
    { name: 'CẬP NHẬT', uid: 'updateDate', sortable: true },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const videos = [
    {
        id: 1,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    },
    {
        id: 2,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    },
    {
        id: 3,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    },
    {
        id: 4,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    },
    {
        id: 5,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    },
    {
        id: 6,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    }
];

type Video = (typeof videos)[0];

const Videos: React.FC<VideosProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['id', 'name', 'courseName', 'teacher', 'subject', 'createdDate', 'updateDate', 'action'])
    );
    const [videos, setVideos] = useState<VideoCardType[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [updateState, setUpdateState] = useState<Boolean>(false);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const {
        status,
        error,
        data: videosData,
        isPreviousData
    } = useQuery({
        queryKey: ['videosApproveAdmin', { page, rowsPerPage, updateState }],
        queryFn: () => videoApi.getAllOfAdmin('WAITING', page - 1, rowsPerPage)
    });

    useEffect(() => {
        if (videosData?.data) {
            setVideos(videosData.data);
            setTotalPage(videosData.totalPage);
            setTotalRow(videosData.totalRow);
        }
    }, [videosData]);

    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();

    const handleStatusChange = async (id: number, verifyStatus: string) => {
        try {
            onLoading();
            const res = await videoApi.changeVideoStatus({
                id,
                verifyStatus
            });

            if (!res.data.code) {
                if (verifyStatus == 'ACCEPTED') {
                    onSuccess({
                        title: 'Duyệt thành công',
                        content: 'Video đã được duyệt thành công'
                    });
                } else if (verifyStatus == 'REJECT') {
                    onSuccess({
                        title: 'Đã từ chối',
                        content: 'Đã từ chối video thành công'
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
            console.error('Error changing video status', error);
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

    const onApproveOpen = (id: number, action: string) => {
        onWarning({
            title: 'Xác nhận duyệt',
            content: 'Video sẽ được hiện thị sau khi được duyệt. Bạn chắc chứ?',
            activeFn: () => handleStatusChange(id, action)
        });
        onOpen();
    };

    const onDeclineOpen = (id: number, action: string) => {
        onDanger({
            title: 'Xác nhận từ chối',
            content: 'Video sẽ không được hiển thị sau khi đã từ chối. Bạn chắc chứ?',
            activeFn: () => handleStatusChange(id, action)
        });
        onOpen();
    };

    const renderCell = useCallback((video: Video, columnKey: Key) => {
        const cellValue = video[columnKey as keyof Video];

        switch (columnKey) {
            case 'rating':
                return (cellValue as number).toFixed(1);
            case 'teacher':
                return (
                    <User
                        avatarProps={{ radius: 'full', size: 'sm', src: 'https://i.pravatar.cc/150?img=4' }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
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
                            <DropdownMenu aria-label="Options">
                                <DropdownItem color="success" onClick={() => onApproveOpen(video?.id, 'ACCEPTED')}>
                                    Duyệt
                                </DropdownItem>
                                <DropdownItem color="danger" onClick={() => onDeclineOpen(video?.id, 'REJECT')}>
                                    Từ chối
                                </DropdownItem>
                                <DropdownItem color="primary">Xem chi tiết</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case 'createdDate':
            case 'updateDate':
                const dateValue = cellValue ? new Date(cellValue) : new Date();

                const formattedDate = new Intl.DateTimeFormat('en-GB', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                })?.format(dateValue);

                return formattedDate;
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Video chờ phê duyệt</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                <div className="flex flex-col gap-4 mt-8">
                    <div className="flex justify-between gap-3 items-end">
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
                        <div className="flex gap-3">
                            <Dropdown>
                                <DropdownTrigger className="flex">
                                    <Button
                                        endContent={<BsChevronDown className="text-small" />}
                                        size="sm"
                                        variant="bordered"
                                        color="primary"
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
                    items={videos || []}
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

export default Videos;
