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
import TableContent from '@/components/table';
import Link from 'next/link';
import { BsChevronDown, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { DiscussionType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { discussionApi } from '@/api-client';
import { Spin } from 'antd';
import { useCustomModal, useSelectedSidebar } from '@/hooks';
import { toast } from 'react-toastify';
import { capitalize } from '@/components/table/utils';
interface MyPostListProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    ENABLE: 'success',
    DISABLE: 'danger',
    DELETED: 'danger',
    BANNED: 'danger'
};

const columns = [
    { name: 'Chủ Đề', uid: 'topicName', sortable: false },
    { name: 'TÁC GIẢ', uid: 'ownerFullName', sortable: false },
    { name: 'TIÊU ĐỀ', uid: 'title', sortable: false },
    { name: 'TƯƠNG TÁC', uid: 'reactCount' },
    { name: 'NGÀY TẠO', uid: 'createTime' },
    { name: 'TRẠNG THÁI', uid: 'status' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const MyPostList: React.FC<MyPostListProps> = ({}) => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['topicName', 'title', 'reactCount', 'ownerFullName', 'createTime', 'status', 'action'])
    );
    const [discussions, setDiscussions] = useState<DiscussionType[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [search, setSearch] = useState<string>('');
    const [searchInput, setSearchInput] = useState('');
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['-1']));
    const [statusFilterStatus, setStatusFilterStatus] = useState<Selection>(new Set(['ALL']));
    const {
        status,
        error,
        data: discussionsData,
        isPreviousData,
        refetch
    } = useQuery({
        queryKey: [
            'my-teacher-discussions',
            {
                page,
                rowsPerPage,
                statusFilter: Array.from(statusFilter)[0] as number,
                search,
                statusFilterStatus: Array.from(statusFilterStatus)[0] as string
            }
        ],
        queryFn: () =>
            discussionApi.getAllMyDiscussion(
                search,
                Array.from(statusFilter)[0] === '-1' ? '' : (Array.from(statusFilter)[0] as string),
                Array.from(statusFilterStatus)[0] === 'ALL' ? '' : (Array.from(statusFilterStatus)[0] as string),
                page - 1,
                rowsPerPage,
                'createTime',
                'DESC'
            )
    });
    const { data: topicsData } = useQuery({
        queryKey: ['topics'],
        queryFn: () => discussionApi.getAll(0, 100)
    });
    useEffect(() => {
        if (discussionsData?.data) {
            setDiscussions(discussionsData.data);
            setTotalPage(discussionsData.totalPage);
            setTotalRow(discussionsData.totalRow);
        }
    }, [discussionsData]);
    const handleSearch = (searchInput: string) => {
        // Set the search state
        setSearch(searchInput);
    };
    const topicsOptions = useMemo(() => {
        if (!topicsData) return [];
        const allOption = { id: -1, name: 'Tất cả', status: 'ENABLE' };
        const topicOptions = Array.isArray(topicsData?.data) ? [allOption, ...topicsData?.data] : [allOption];
        return topicOptions;
    }, [topicsData]);
    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    const handleStatusChange = async (id: number) => {
        let toastLoading;
        try {
            onClose();
            toastLoading = toast.loading('Đang xóa');
            const res = await discussionApi.deleteDiscussion(id);
            if (!res?.data?.code) {
                toast.success('Xóa thành công');
                toast.dismiss(toastLoading);
                refetch();
            }
        } catch (error) {
            // Handle error
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error changing user status', error);
        }
    };
    const onDeactivateOpen = (id: number) => {
        onDanger({
            title: 'Xác nhận xóa thảo luận',
            content: 'Bài thảo luận này sẽ không được hiện thị sau khi bị xóa. Bạn chắc chứ?',
            activeFn: () => handleStatusChange(id)
        });
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

    const { onTeacherKeys } = useSelectedSidebar();

    useEffect(() => {
        setPage(1);
    }, [statusFilter, statusFilterStatus, search]);

    useEffect(() => {
        onTeacherKeys(['13']);
    }, []);

    const renderCell = useCallback((post: any, columnKey: Key) => {
        const cellValue = post[columnKey as keyof any];

        switch (columnKey) {
            case 'title':
                if (post.status === 'DELETED' || post.status === 'BANNED') {
                    return <Link href={'#'}>{cellValue}</Link>;
                } else {
                    return <Link href={`/teacher/discussion/${post?.id}`}>{cellValue}</Link>;
                }
            case 'ownerFullName':
                return (
                    <User
                        avatarProps={{
                            radius: 'full',
                            size: 'sm',
                            src: post.ownerAvatar ? post.ownerAvatar : 'https://i.pravatar.cc/150?img=4'
                        }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    >
                        {post.ownerFullName}
                    </User>
                );
            case 'createTime':
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
            case 'status':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[post.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'ENABLE'
                            ? 'Hoạt động'
                            : cellValue === 'DELETED'
                            ? 'Đã xóa'
                            : cellValue === 'BANNED'
                            ? 'Bị cấm'
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
                            <DropdownMenu aria-label="Options" disabledKeys={['viewDis', 'editDis', 'delDis']}>
                                <DropdownItem
                                    color="primary"
                                    key={post.status === 'DELETED' || post.status === 'BANNED' ? 'viewDis' : 'view'}
                                    as={Link}
                                    href={`/teacher/discussion/${post.id}`}
                                >
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem
                                    color="warning"
                                    key={post.status === 'DELETED' || post.status === 'BANNED' ? 'editDis' : 'edit'}
                                    as={Link}
                                    href={`/teacher/discussion/edit/${post?.id}`}
                                >
                                    Chỉnh sửa
                                </DropdownItem>
                                <DropdownItem
                                    color="danger"
                                    key={post.status === 'DELETED' || post.status === 'BANNED' ? 'delDis' : 'delete'}
                                    onClick={() => onDeactivateOpen(post?.id)}
                                >
                                    Xóa bài đăng
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
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Bài đăng của tôi</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                <div className="flex flex-col gap-4 mt-8">
                    <div className="sm:flex justify-between gap-3 items-end">
                        <div className="flex flex-[1] gap-2 md:mt-0 mt-4">
                            <Input
                                isClearable
                                className="w-full sm:max-w-[50%] border-1"
                                placeholder="Tìm kiếm..."
                                startContent={<BsSearch className="text-default-300" />}
                                value={searchInput}
                                variant="bordered"
                                color="primary"
                                onClear={() => {
                                    setSearchInput('');
                                    handleSearch('');
                                }}
                                onChange={e => setSearchInput(e.target.value)}
                            />
                            <Button color="primary" className="" onClick={() => handleSearch(searchInput)}>
                                Tìm kiếm
                            </Button>
                        </div>
                        <div className="ml-auto flex gap-3 mt-4 sm:mt-0">
                            <Dropdown>
                                <DropdownTrigger className="flex">
                                    <Button
                                        endContent={<BsChevronDown className="text-small" />}
                                        size="sm"
                                        variant="bordered"
                                        color="primary"
                                    >
                                        Chủ đề
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={true}
                                    selectedKeys={statusFilter}
                                    selectionMode="single"
                                    onSelectionChange={setStatusFilter}
                                >
                                    {topicsOptions.map((column: any, index: number) => (
                                        <DropdownItem key={column?.id} className="capitalize">
                                            {capitalize(column.name)}
                                        </DropdownItem>
                                    ))}
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
                                        Trạng thái
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={statusFilterStatus}
                                    selectionMode="single"
                                    onSelectionChange={setStatusFilterStatus}
                                >
                                    <DropdownItem key="ALL" className="capitalize">
                                        {capitalize('Tất cả')}
                                    </DropdownItem>
                                    <DropdownItem key="ENABLE" className="capitalize">
                                        {capitalize('Hoạt động')}
                                    </DropdownItem>
                                    <DropdownItem key="DISABLE" className="capitalize">
                                        {capitalize('Vô hiệu')}
                                    </DropdownItem>
                                    <DropdownItem key="DELETED" className="capitalize">
                                        {capitalize('Đã xóa')}
                                    </DropdownItem>
                                    <DropdownItem key="BANNED" className="capitalize">
                                        {capitalize('Bị Cấm')}
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
                    items={discussions || []}
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

export default MyPostList;
