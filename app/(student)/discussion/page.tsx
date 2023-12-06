'use client';

import { ChangeEvent, Key, useCallback, useEffect, useMemo, useState } from 'react';
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
import { BsChevronDown, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
import TableContent from '@/components/table';
import { discussionApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { DiscussionType } from '@/types/discussion';
import { Spin } from 'antd';

interface PostListProps {}

const columns = [
    // { name: 'ID', uid: 'id', sortable: true },
    { name: 'CHỦ ĐỀ', uid: 'topicName', sortable: true },
    { name: 'TÁC GIẢ', uid: 'ownerFullName', sortable: true },
    { name: 'TIÊU ĐỀ', uid: 'title', sortable: true },
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
        new Set(['topicName', 'ownerFullName', 'title', 'createTime', 'action'])
    );
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['-1']));
    const [discussions, setDiscussions] = useState<DiscussionType[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [selectedTopic, setSelectedTopic] = useState<Number>(1);
    const [search, setSearch] = useState<string>('');
    const [searchInput, setSearchInput] = useState('');
    const {
        status,
        error,
        data: discussionsData,
        isPreviousData
    } = useQuery({
        queryKey: ['discussions', { page, rowsPerPage, statusFilter: Array.from(statusFilter)[0] as number, search }],
        queryFn: () => {
            // Check if statusFilter is -1
            return discussionApi.getAllOfConversation(
                search,
                Array.from(statusFilter)[0] === '-1' ? '' : (Array.from(statusFilter)[0] as string),
                page - 1,
                rowsPerPage,
                'createTime',
                'DESC'
            );
        }
    });

    const { data: topicsData } = useQuery({
        queryKey: ['topics'],
        queryFn: () => discussionApi.getAll(0, 100)
    });

    const topicsOptions = useMemo(() => {
        if (!topicsData) return [];
        const allOption = { id: -1, name: 'Tất cả', status: 'ENABLE' };
        const topicOptions = Array.isArray(topicsData?.data) ? [allOption, ...topicsData?.data] : [allOption];
        return topicOptions;
    }, [topicsData]);

    useEffect(() => {
        if (discussionsData?.data) {
            setDiscussions(discussionsData.data);
            setTotalPage(discussionsData.totalPage);
            setTotalRow(discussionsData.totalRow);
        }
    }, [discussionsData]);

    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);
    console.log(statusFilter);

    const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);
    const handleSearch = (searchInput: string) => {
        // Set the search state
        setSearch(searchInput);
    };
    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue('');
        }
    }, []);

    const renderCell = useCallback((post: any, columnKey: Key) => {
        const cellValue = post[columnKey as keyof any];

        switch (columnKey) {
            case 'title':
                return <Link href={`/discussion/${post?.id}`}>{cellValue}</Link>;
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
            case 'action':
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <BsThreeDotsVertical className="text-default-400" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Table Columns">
                                <DropdownItem color="primary" as={Link} href={`/discussion/${post.id}`}>
                                    Xem chi tiết
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
        <div className="w-[90%] xl:w-4/5 mx-auto my-8">
            <h3 className="text-xl font-semibold text-blue-500 mt-4 sm:mt-0">Tất cả bài đăng</h3>
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
