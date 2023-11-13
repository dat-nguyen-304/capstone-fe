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
import { useConfirmModal } from '@/hooks';

interface VideosProps {}

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN VIDEO', uid: 'videoName', sortable: true },
    { name: 'KHÓA HỌC', uid: 'courseName' },
    { name: 'MÔN HỌC', uid: 'subject' },
    { name: 'GIÁO VIÊN', uid: 'teacher' },
    { name: 'LIKE', uid: 'like' },
    { name: 'NGÀY TẠO', uid: 'createdAt', sortable: true },
    { name: 'CẬP NHẬT', uid: 'updatedAt', sortable: true },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const videos = [
    {
        id: 1,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        like: '40',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    },
    {
        id: 2,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        like: '40',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    },
    {
        id: 3,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        like: '40',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    },
    {
        id: 4,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        like: '40',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    },
    {
        id: 5,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        like: '40',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    },
    {
        id: 6,
        videoName: 'Làm quen với abcxyz',
        courseName: 'Lấy gốc thần tốc',
        subject: 'Toán học',
        teacher: 'Nguyễn Văn A',
        like: '40',
        createdAt: '02/11/2023',
        updatedAt: '02/11/2023'
    }
];

type Video = (typeof videos)[0];

const Videos: React.FC<VideosProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set([
            'id',
            'videoName',
            'courseName',
            'teacher',
            'subject',
            'like',
            'createdAt',
            'updatedAt',
            'status',
            'action'
        ])
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

    const renderCell = useCallback((video: Video, columnKey: Key) => {
        const cellValue = video[columnKey as keyof Video];

        switch (columnKey) {
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
                            <DropdownMenu>
                                <DropdownItem color="success" onClick={onApproveOpen}>
                                    Duyệt
                                </DropdownItem>
                                <DropdownItem color="danger" onClick={onDeclineOpen}>
                                    Từ chối
                                </DropdownItem>
                                <DropdownItem color="primary" as={Link} href="/admin/preview/course/1">
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

    const { onOpen, onTitle, onContent, onType } = useConfirmModal();

    const onApproveOpen = () => {
        onTitle('Xác nhận duyệt');
        onContent('Khóa học sẽ được đăng bán sau khi được duyệt. Bạn chắc chứ?');
        onType('warning');
        onOpen();
    };

    const onDeclineOpen = () => {
        onTitle('Xác nhận từ chối');
        onContent('Khóa học sẽ không được đăng bán sau khi đã từ chối. Bạn chắc chứ?');
        onType('danger');
        onOpen();
    };

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Video chờ phê duyệt</h3>
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
                    <span className="text-default-400 text-xs sm:text-sm">Tìm thấy {videos.length} kết quả</span>
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
                items={videos}
                page={page}
                setPage={setPage}
                sortDescriptor={sortDescriptor}
                setSortDescriptor={setSortDescriptor}
                totalPage={2}
            />
        </div>
    );
};

export default Videos;
