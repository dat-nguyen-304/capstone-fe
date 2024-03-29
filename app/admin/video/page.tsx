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
import { videoApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { VideoCardType } from '@/types';
import { Spin } from 'antd';
import { useCustomModal, useSelectedSidebar } from '@/hooks';
interface VideosProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    AVAILABLE: 'success',
    REJECT: 'danger',
    BANNED: 'danger',
    WAITING: 'primary',
    UPDATING: 'primary',
    UNAVAILABLE: 'warning'
};
const columns = [
    { name: 'TÊN VIDEO', uid: 'name', sortable: false },
    { name: 'KHÓA HỌC', uid: 'courseName' },
    { name: 'GIÁO VIÊN', uid: 'teacherName' },
    { name: 'MÔN HỌC', uid: 'subject' },
    { name: 'LIKE', uid: 'like' },
    { name: 'NGÀY TẠO', uid: 'createDate', sortable: false },
    { name: 'CẬP NHẬT', uid: 'updateDate', sortable: false },
    { name: 'TRẠNG THÁI', uid: 'status' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const Videos: React.FC<VideosProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set([
            'name',
            'courseName',
            'teacherName',
            'subject',
            'like',
            'createDate',
            'updateDate',
            'status',
            'action'
        ])
    );
    const [videos, setVideos] = useState<VideoCardType[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [sort, setSort] = useState<Selection>(new Set(['ALL']));
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const {
        status,
        error,
        data: videosData,
        isPreviousData,
        refetch
    } = useQuery({
        queryKey: [
            'videosAdmin',
            {
                page,
                rowsPerPage,
                statusFilter: Array.from(statusFilter)[0] as string,
                sort: Array.from(sort)[0] as string
            }
        ],
        queryFn: () =>
            videoApi.getAllOfAdmin(
                Array.from(statusFilter)[0] as string,
                page - 1,
                rowsPerPage,
                (Array.from(sort)[0] as string) == 'DateDesc' || (Array.from(sort)[0] as string) == 'DateASC'
                    ? 'createdDate'
                    : 'id',
                (Array.from(sort)[0] as string) == 'DateDesc' ? 'DESC' : 'ASC'
            )
    });

    useEffect(() => {
        if (videosData?.data) {
            setVideos(videosData.data);
            setTotalPage(videosData.totalPage);
            setTotalRow(videosData.totalRow);
        }
    }, [videosData]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, sort]);

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

                refetch();
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

    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();

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
    const { onAdminKeys } = useSelectedSidebar();

    useEffect(() => {
        onAdminKeys(['5']);
    }, []);
    const renderCell = useCallback((video: any, columnKey: Key) => {
        const cellValue = video[columnKey as keyof any];

        switch (columnKey) {
            case 'teacherName':
                return (
                    <User
                        avatarProps={{
                            radius: 'full',
                            size: 'sm',
                            src: video?.teacherAvatar ? video?.teacherAvatar : 'https://i.pravatar.cc/150?img=4'
                        }}
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
                        color={statusColorMap[video.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'AVAILABLE'
                            ? 'Hoạt động'
                            : cellValue === 'WAITING'
                            ? 'Chờ xác thực'
                            : cellValue === 'REJECT'
                            ? 'Bị từ chối'
                            : cellValue === 'BANNED'
                            ? 'Bị Xóa'
                            : cellValue === 'UPDATING'
                            ? 'Chờ cập nhật'
                            : 'Vô hiệu'}
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
                                <DropdownItem as={Link} href={`/admin/video/${video?.id}`}>
                                    Xem chi tiết
                                </DropdownItem>
                                {/* <DropdownItem
                                    color="success"
                                    key={video.status === 'AVAILABLE' ? 'enableDis' : 'enable'}
                                    onClick={() => onApproveOpen(video?.id, 'ACCEPTED')}
                                >
                                    Duyệt
                                </DropdownItem>
                                <DropdownItem
                                    color="danger"
                                    key={video.status === 'REJECT' ? 'bannedDis' : 'banned'}
                                    onClick={() => onDeclineOpen(video?.id, 'REJECT')}
                                >
                                    Từ chối
                                </DropdownItem> */}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case 'createDate':
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
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Danh sách video</h3>
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
                                    <DropdownItem key="AVAILABLE" className="capitalize">
                                        {capitalize('Hoạt Động')}
                                    </DropdownItem>
                                    {/* <DropdownItem key="WAITING" className="capitalize">
                                        {capitalize('Chờ Xác Thực')}
                                    </DropdownItem>
                                    <DropdownItem key="UPDATING" className="capitalize">
                                        {capitalize('Chờ Cập Nhật')}
                                    </DropdownItem>
                                    <DropdownItem key="UNAVAILABLE" className="capitalize">
                                        {capitalize('Vô Hiệu')}
                                    </DropdownItem>
                                    <DropdownItem key="REJECT" className="capitalize">
                                        {capitalize('Bị Từ Chối')}
                                    </DropdownItem> */}
                                    <DropdownItem key="BANNED" className="capitalize">
                                        {capitalize('Bị Xóa')}
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
