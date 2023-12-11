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
import { teacherApi, userApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { TeacherType } from '@/types';
import { Spin } from 'antd';
import { useCustomModal, useInputModal } from '@/hooks';
import { toast } from 'react-toastify';
import { InputModal } from '@/components/modal/InputModal';
interface TeachersVerifyProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    ENABLE: 'success',
    WAITTING: 'primary',
    DISABLE: 'danger',
    BANNED: 'danger'
};

const columns = [
    // { name: 'ID', uid: 'id', sortable: true },
    { name: 'TIÊU ĐỀ', uid: 'fullName', sortable: false },
    { name: 'Email', uid: 'email', sortable: false },
    { name: 'MÔN HỌC', uid: 'subject' },
    { name: 'ĐÃ THAM GIA', uid: 'createDate', sortable: false },
    { name: 'TRẠNG THÁI', uid: 'status' },
    { name: 'THAO TÁC', uid: 'action', sortable: false }
];

type Teacher = {
    id: number;
    name: string;
    subject: string[];
    createdAt: string;
    status: string;
    email: string;
};

const VerifyTeachers: React.FC<TeachersVerifyProps> = () => {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['fullName', 'email', 'subject', 'createDate', 'status', 'action'])
    );
    const [teachers, setTeachers] = useState<TeacherType[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['ALL']));
    const [updateState, setUpdateState] = useState<Boolean>(false);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [declineId, setDeclineId] = useState<number>();
    const {
        status,
        error,
        data: teachersData,
        isPreviousData,
        refetch
    } = useQuery({
        queryKey: ['admin-verify-teachers', { page, rowsPerPage }],
        queryFn: () => teacherApi.getTeachersVerificationList(page - 1, rowsPerPage, 'id', 'ASC')
    });

    useEffect(() => {
        if (teachersData?.data) {
            setTeachers(teachersData.data);
            setTotalPage(teachersData.totalPage);
            setTotalRow(teachersData?.data?.length);
        }
    }, [teachersData]);

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
    const { onOpen: onInputOpen, onClose: onInputClose, onDescription, description } = useInputModal();

    const handleStatusChange = async (id: number, verifyStatus: boolean) => {
        let toastLoading;

        try {
            onClose();
            onInputClose();
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            const res = await teacherApi.verifyTeacherByAdmin({
                teacherId: id,
                verify: verifyStatus,
                reason: description
            });

            if (!res.data.code) {
                if (verifyStatus === true) {
                    toast.success('Giáo viên đã được xác nhận thành công');
                    refetch();
                } else if (verifyStatus === false) {
                    toast.success('Xác nhận giáo viên đã từ chối thành công');
                    refetch();
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
            content: 'Danh tính của giáo viên sẽ được duyệt sau khi được duyệt. Bạn chắc chứ?',
            activeFn: () => handleStatusChange(id, true)
        });
        onOpen();
    };

    const onDeclineOpen = (id: number) => {
        onDanger({
            title: 'Xác nhận từ chối',
            content: 'Danh tính của giáo viên sẽ không được hiển thị sau khi đã từ chối. Bạn chắc chứ?',
            activeFn: () => {
                onClose();
                onInputOpen();
            }
        });
        setDeclineId(id);
        onOpen();
    };

    const renderCell = useCallback((teacher: any, columnKey: Key) => {
        let res: string | number;
        const cellValue = teacher[columnKey as keyof any];
        if (Array.isArray(cellValue) || cellValue === undefined) res = '';
        else res = cellValue;
        switch (columnKey) {
            case 'fullName':
                return (
                    <User
                        avatarProps={{
                            radius: 'full',
                            size: 'sm',
                            src: teacher?.url ? teacher?.url : 'https://i.pravatar.cc/150?img=4'
                        }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    />
                );
            case 'subject':
                return (
                    <div className="gap-2">
                        {(cellValue as string[]).map(sub => (
                            <Chip size="sm" color="primary" variant="flat" className="mr-1" key={sub}>
                                {sub}
                            </Chip>
                        ))}
                    </div>
                );
            case 'createDate':
                const dateValue = cellValue ? new Date(cellValue) : new Date();

                const formattedDate = new Intl.DateTimeFormat('en-GB', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                })?.format(dateValue);

                return formattedDate;
            case 'status':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[teacher.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue === 'ENABLE'
                            ? 'Hoạt động'
                            : cellValue === 'WAITTING'
                            ? 'Chờ Xác Thực'
                            : cellValue === 'BANNED'
                            ? 'Tài Khoản Bị Cấm'
                            : 'Vô Hiệu'}
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
                                <DropdownItem color="primary" as={Link} href={`/admin/verify-teacher/${teacher.id}`}>
                                    Xem chi tiết
                                </DropdownItem>
                                <DropdownItem color="success" onClick={() => onApproveOpen(teacher?.id)}>
                                    Duyệt
                                </DropdownItem>
                                <DropdownItem color="danger" onClick={() => onDeclineOpen(teacher?.id)}>
                                    Từ chối
                                </DropdownItem>
                                {/* <DropdownItem
                                    color="danger"
                                    key={teacher.status === 'BANNED' ? 'bannedDis' : 'banned'}
                                    onClick={() => onDeclineOpen(teacher.id)}
                                >
                                    Cấm Người dùng
                                </DropdownItem> */}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return res;
        }
    }, []);

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Danh sách xác nhận giáo viên</h3>
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
                    items={teachers || []}
                    page={page}
                    setPage={setPage}
                    sortDescriptor={sortDescriptor}
                    setSortDescriptor={setSortDescriptor}
                    totalPage={totalPage || 1}
                />
            </Spin>
            <InputModal activeFn={() => handleStatusChange(declineId as number, false)} />
        </div>
    );
};

export default VerifyTeachers;
