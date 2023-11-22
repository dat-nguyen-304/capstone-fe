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
    User,
    useDisclosure
} from '@nextui-org/react';
import Link from 'next/link';
import { BsChevronDown, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
import TableContent from '@/components/table';
import { useCustomModal } from '@/hooks';
import { examApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { ExamCardType } from '@/types';
import { Spin } from 'antd';

interface ExamsProps {}
function getSubjectName(subjectCode: string) {
    switch (subjectCode) {
        case 'MATHEMATICS':
            return 'Toán học';
        case 'ENGLISH':
            return 'Tiếng anh';
        case 'PHYSICS':
            return 'Vật lí';
        case 'CHEMISTRY':
            return 'Hóa học';
        case 'BIOLOGY':
            return 'Sinh học';
        case 'HISTORY':
            return 'Lịch sử';
        case 'GEOGRAPHY':
            return 'Địa lý';
        default:
            return null;
    }
}
const statusColorMap: Record<string, ChipProps['color']> = {
    ENABLE: 'success',
    DISABLE: 'danger',
    DELETED: 'danger',
    BANNED: 'danger'
};

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TIÊU ĐỀ', uid: 'name', sortable: true },
    { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'ĐÃ TẠO', uid: 'createTime', sortable: true },
    { name: 'TRẠNG THÁI', uid: 'status' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

const Exams: React.FC<ExamsProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['id', 'name', 'subject', 'createTime', 'status', 'action'])
    );
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['active', 'unActive']));
    const [updateState, setUpdateState] = useState<Boolean>(false);
    const [exams, setExams] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const { status, error, data, isPreviousData } = useQuery({
        queryKey: ['exams', { page, rowsPerPage, updateState }],
        // keepPreviousData: true,
        queryFn: () => examApi.getAllByAdmin(page - 1, rowsPerPage)
    });
    useEffect(() => {
        if (data?.data) {
            setExams(data.data);
            setTotalPage(data.totalPage);
            setTotalRow(data.totalRow);
        }
    }, [data]);
    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };

    console.log(exams);

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

    const handleStatusChange = async (id: number) => {
        try {
            onLoading();
            const res = await examApi.deleteExam(id);
            if (!res.data.code) {
                onSuccess({
                    title: 'Đã xóa bài thi thành công',
                    content: 'Bài thi đã được xóa thành công'
                });
                setUpdateState(prev => !prev);
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

    const onDeactivateOpen = (id: number) => {
        onDanger({
            title: 'Xác nhận vô hiệu hóa',
            content: 'Bài thi này sẽ không được hiện thị sau khi vô hiệu hóa. Bạn chắc chứ?',
            activeFn: () => handleStatusChange(id)
        });
        onOpen();
    };

    const renderCell = useCallback((exam: any, columnKey: Key) => {
        const cellValue = exam[columnKey as keyof any];

        switch (columnKey) {
            case 'status':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[exam.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'ENABLE' ? 'Hoạt động' : cellValue === 'DELETED' ? 'Đã xóa' : 'Vô Hiệu'}
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
                            <DropdownMenu aria-label="Table Columns">
                                <DropdownItem color="primary" as={Link} href={`/admin/exam/${exam?.id}`}>
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem color="warning" as={Link} href={`/admin/exam/edit/${exam?.id}`}>
                                    Chỉnh sửa
                                </DropdownItem>
                                <DropdownItem color="danger" onClick={() => onDeactivateOpen(exam?.id)}>
                                    Vô hiệu hóa
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
                    day: 'numeric'
                })?.format(dateValue);

                return formattedDate;
            case 'subject':
                return getSubjectName(cellValue);
            default:
                return cellValue;
        }
    }, []);
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Danh sách bài thi</h3>
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
                                    selectionMode="multiple"
                                    onSelectionChange={setStatusFilter}
                                >
                                    <DropdownItem key="active" className="capitalize">
                                        {capitalize('hoạt động')}
                                    </DropdownItem>
                                    <DropdownItem key="unActive" className="capitalize">
                                        {capitalize('vô hiệu hóa')}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
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
                    items={exams || []}
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

export default Exams;
