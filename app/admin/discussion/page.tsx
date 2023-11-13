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
import { BsChevronDown, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
import TableContent from '@/components/table';

interface PostListProps {}

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÁC GIẢ', uid: 'author', sortable: true },
    { name: 'TIÊU ĐỀ', uid: 'title', sortable: true },
    { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'TƯƠNG TÁC', uid: 'react' },
    { name: 'NGÀY TẠO', uid: 'createdAt' },
    { name: 'THAO TÁC', uid: 'action' }
];

const posts = [
    {
        id: 1,
        author: 'Tony Reichert',
        title: 'Ngẫng mặt hận đời',
        subject: 'Toán',
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    },
    {
        id: 2,
        author: 'Tony Reichert',
        title: 'Management',
        subject: 'Toán',
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    },
    {
        id: 3,
        author: 'Tony Reichert',
        title: 'Management',
        subject: 'Toán',
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    },
    {
        id: 4,
        author: 'Tony Reichert',
        title: 'Management',
        subject: 'Toán',
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    },
    {
        id: 5,
        author: 'Tony Reichert',
        title: 'Management',
        subject: 'Toán',
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    },
    {
        id: 6,
        author: 'Tony Reichert',
        title: 'Management',
        subject: 'Toán',
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    }
];

type Post = (typeof posts)[0];

const PostList: React.FC<PostListProps> = ({}) => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['id', 'title', 'subject', 'author', 'createdAt', 'action'])
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

    const renderCell = useCallback((post: Post, columnKey: Key) => {
        const cellValue = post[columnKey as keyof Post];

        switch (columnKey) {
            case 'author':
                return (
                    <User
                        avatarProps={{ radius: 'full', size: 'sm', src: 'https://i.pravatar.cc/150?img=4' }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    >
                        {post.author}
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
                            <DropdownMenu>
                                <DropdownItem as={Link} href="/admin/discussion/2">
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
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Thảo luận</h3>
            <div className="flex flex-col gap-4 mt-8">
                <div className="flex justify-between gap-3 items-end">
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
                    <div className="flex gap-3">
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
                    <span className="text-default-400 text-xs sm:text-sm">Tìm thấy {posts.length} kết quả</span>
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
                items={posts}
                page={page}
                setPage={setPage}
                sortDescriptor={sortDescriptor}
                setSortDescriptor={setSortDescriptor}
                totalPage={2}
            />
        </div>
    );
};

export default PostList;
