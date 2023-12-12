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
import { useQuery } from '@tanstack/react-query';
import { discussionApi } from '@/api-client';
import { DiscussionType } from '@/types/discussion';
import { Spin } from 'antd';
import { useCustomModal } from '@/hooks';

interface PostListProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    ENABLE: 'success',
    DISABLE: 'danger',
    DELETED: 'danger',
    BANNED: 'danger'
};
const columns = [
    { name: 'CHỦ ĐỀ', uid: 'topicName', sortable: false },
    { name: 'TÁC GIẢ', uid: 'ownerFullName', sortable: false },
    { name: 'TIÊU ĐỀ', uid: 'title', sortable: false },
    { name: 'TRẠNG THÁI', uid: 'status', sortable: false },
    { name: 'NGÀY TẠO', uid: 'createTime' },
    { name: 'THAO TÁC', uid: 'action' }
];

function getRole(role: string) {
    const roleNames: { [key: string]: string | null } = {
        STUDENT: 'Học sinh',
        TEACHER: 'Giáo viên',
        ADMIN: 'Quản trị viên'
    };

    return roleNames[role] || null;
}
const PostList: React.FC<PostListProps> = ({}) => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['topicName', 'ownerFullName', 'title', 'status', 'createTime', 'action'])
    );
    const [discussions, setDiscussions] = useState<DiscussionType[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [topicFilter, setTopicFilter] = useState<Selection>(new Set(['-1']));
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [search, setSearch] = useState<string>('');
    const [searchInput, setSearchInput] = useState('');
    const { data: topicsData } = useQuery({
        queryKey: ['topics'],
        queryFn: () => discussionApi.getAll(0, 100)
    });
    const {
        status,
        error,
        data: discussionsData,
        isPreviousData,
        refetch
    } = useQuery({
        queryKey: [
            'admin-discussions',
            {
                page,
                rowsPerPage,
                topicFilter: Array.from(topicFilter)[0] as number,
                statusFilter: Array.from(statusFilter)[0] as number,
                search
            }
        ],
        queryFn: () => {
            // Check if statusFilter is -1
            return discussionApi.getAllOfConversationByAmin(
                search,
                Array.from(statusFilter)[0] === 'ALL' ? '' : (Array.from(statusFilter)[0] as string),
                Array.from(topicFilter)[0] === '-1' ? '' : (Array.from(topicFilter)[0] as string),
                page - 1,
                rowsPerPage,
                'createTime',
                'DESC'
            );
        }
    });
    useEffect(() => {
        if (discussionsData?.data) {
            setDiscussions(discussionsData.data);
            setTotalPage(discussionsData.totalPage);
            setTotalRow(discussionsData.totalRow);
        }
    }, [discussionsData]);

    const topicsOptions = useMemo(() => {
        if (!topicsData) return [];
        const allOption = { id: -1, name: 'Tất cả', status: 'ENABLE' };
        const topicOptions = Array.isArray(topicsData?.data) ? [allOption, ...topicsData?.data] : [allOption];
        return topicOptions;
    }, [topicsData]);
    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const handleSearch = (searchInput: string) => {
        // Set the search state
        setSearch(searchInput);
    };

    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();

    const handleStatusChange = async (id: number, status: string) => {
        try {
            onLoading();
            const res = await discussionApi.updateStatusDiscussion(id, status);
            if (!res.data.code) {
                onSuccess({
                    title: `${
                        status === 'ENABLE'
                            ? 'Đã kích hoạt thành công'
                            : status === 'BANNED'
                            ? 'Đã cấm bài đăng thành công'
                            : 'Đã vô hiệu hóa bài đăng thành công'
                    } `,
                    content: `${
                        status === 'ENABLE'
                            ? 'Đã kích hoạt thành công'
                            : status === 'BANNED'
                            ? 'Bài đăng đã bị cấm thành công'
                            : 'Bài đăng đã bị vô hiệu hóa thành công'
                    } `
                });
                refetch();
            }
        } catch (error) {
            // Handle error
            onDanger({
                title: 'Có lỗi xảy ra',
                content: 'Hệ thống gặp trục trặc, thử lại sau ít phút'
            });
            console.error('Error changing user status', error);
        }
    };

    const onActivateOpen = (id: number, status: string) => {
        onWarning({
            title: `Xác nhận kích hoạt`,
            content: `Bài đăng này sẽ được hiện thị sau khi kích hoạt. Bạn chắc chứ?`,
            activeFn: () => handleStatusChange(id, status)
        });
        onOpen();
    };
    const onDeactivateOpen = (id: number, status: string) => {
        onDanger({
            title: `Xác nhận cấm`,
            content: `Bài đăng này sẽ không được hiện thị sau khi  cấm. Bạn chắc chứ?`,
            activeFn: () => handleStatusChange(id, status)
        });
        onOpen();
    };

    const renderCell = useCallback((post: any, columnKey: Key) => {
        const cellValue = post[columnKey as keyof any];

        switch (columnKey) {
            case 'title':
                return <Link href={`/admin/discussion/${post?.id}`}>{cellValue}</Link>;
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
                            : 'Vô Hiệu'}
                    </Chip>
                );
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
                        description={getRole(post.ownerRole)}
                    >
                        {post.ownerFullName}
                    </User>
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
                            <DropdownMenu aria-label="Options" disabledKeys={['viewDis', 'enableDis', 'bannedDis']}>
                                <DropdownItem
                                    as={Link}
                                    href={`/admin/discussion/${post?.id}`}
                                    key={
                                        post?.status === 'DISABLE' ||
                                        post?.status === 'BANNED' ||
                                        post?.status === 'DELETED'
                                            ? 'viewDis'
                                            : 'view'
                                    }
                                >
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem
                                    key={
                                        post?.status === 'ENABLE' || post?.status === 'DELETED' ? 'enableDis' : 'enable'
                                    }
                                    color="success"
                                    onClick={() => onActivateOpen(post?.id, 'ENABLE')}
                                >
                                    Kích hoạt
                                </DropdownItem>
                                <DropdownItem
                                    key={
                                        post?.status === 'DISABLE' ||
                                        post?.status === 'BANNED' ||
                                        post?.status === 'DELETED'
                                            ? 'bannedDis'
                                            : 'ban'
                                    }
                                    color="danger"
                                    onClick={() => onDeactivateOpen(post?.id, 'BANNED')}
                                >
                                    Cấm
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
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

            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Thảo luận</h3>
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
                        <div className="flex gap-3 mt-4 sm:mt-0">
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
                                    selectedKeys={topicFilter}
                                    selectionMode="single"
                                    onSelectionChange={setTopicFilter}
                                >
                                    {topicsOptions?.map((column: any, index: number) => (
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
                                    selectedKeys={statusFilter}
                                    selectionMode="single"
                                    onSelectionChange={setStatusFilter}
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

export default PostList;
