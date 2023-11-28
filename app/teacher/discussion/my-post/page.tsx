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
    Selection,
    SortDescriptor,
    User
} from '@nextui-org/react';
import TableContent from '@/components/table';
import Link from 'next/link';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { DiscussionType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { discussionApi } from '@/api-client';
import { Spin } from 'antd';
import { useCustomModal } from '@/hooks';
import { toast } from 'react-toastify';
interface MyPostListProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    ENABLE: 'success',
    DISABLE: 'danger',
    DELETED: 'danger'
};

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÁC GIẢ', uid: 'ownerFullName', sortable: true },
    { name: 'TIÊU ĐỀ', uid: 'title', sortable: true },
    { name: 'Chủ Đề', uid: 'topicName', sortable: true },
    { name: 'TƯƠNG TÁC', uid: 'reactCount' },
    { name: 'NGÀY TẠO', uid: 'createTime' },
    { name: 'TRẠNG THÁI', uid: 'status' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const MyPostList: React.FC<MyPostListProps> = ({}) => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['id', 'title', 'subject', 'react', 'author', 'createdAt', 'status', 'action'])
    );
    const [discussions, setDiscussions] = useState<DiscussionType[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [updateState, setUpdateState] = useState<Boolean>(false);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const {
        status,
        error,
        data: discussionsData,
        isPreviousData
    } = useQuery({
        queryKey: ['my-teacher-discussions', { page, rowsPerPage, updateState }],
        queryFn: () => discussionApi.getAllMyDiscussion(page - 1, rowsPerPage)
    });
    useEffect(() => {
        if (discussionsData?.data) {
            setDiscussions(discussionsData.data);
            setTotalPage(discussionsData.totalPage);
            setTotalRow(discussionsData.totalRow);
        }
    }, [discussionsData]);
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
                setUpdateState(prev => !prev);
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
    console.log(discussionsData);

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue('');
        }
    }, []);

    const renderCell = useCallback((post: DiscussionType, columnKey: Key) => {
        const cellValue = post[columnKey as keyof DiscussionType];

        switch (columnKey) {
            // case 'author':
            //     return (
            //         <User
            //             avatarProps={{ radius: 'full', size: 'sm', src: 'https://i.pravatar.cc/150?img=4' }}
            //             classNames={{
            //                 description: 'text-default-500'
            //             }}
            //             name={cellValue}
            //         >
            //             {post.author}
            //         </User>
            //     );
            case 'status':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[post.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'ENABLE' ? 'Hoạt động' : cellValue === 'DELETED' ? 'Đã xóa' : 'Vô hiệu'}
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
                                    key={post.status === 'DELETED' ? 'viewDis' : 'view'}
                                    as={Link}
                                    href={`/teacher/discussion/${post.id}`}
                                >
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem
                                    color="warning"
                                    key={post.status === 'DELETED' ? 'editDis' : 'edit'}
                                    as={Link}
                                    href={`/teacher/discussion/edit/${post?.id}`}
                                >
                                    Chỉnh sửa
                                </DropdownItem>
                                <DropdownItem
                                    color="danger"
                                    key={post.status === 'DELETED' ? 'delDis' : 'delete'}
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
