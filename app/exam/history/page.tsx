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
    SortDescriptor
} from '@nextui-org/react';
import StudentLayout from '@/components/header/StudentLayout';
import Link from 'next/link';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
import TableContent from '@/components/table';
import { useQuery } from '@tanstack/react-query';
import { examApi, subjectApi } from '@/api-client';
import { Subject } from '@/types';
import Loader from '@/components/Loader';
import AvgScoreMonthChart from '@/components/chart/exam-history/AvgScoreMonthChart';
import QuantityScoreChart from '@/components/chart/exam-history/QuantityScoreChart';
import { useUser } from '@/hooks';
import NotFound from '@/app/not-found';
import { Spin } from 'antd';

interface ExamHistoryProps {}

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN BÀI THI', uid: 'examName', sortable: true },
    { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'ĐIỂM SỐ', uid: 'grade', sortable: true },
    { name: 'NGÀY', uid: 'finishTime', sortable: true }
];

const getSubjectNameById = (id: number): string => {
    const subjectMap: Record<number, string> = {
        1: 'MATHEMATICS',
        2: 'PHYSICS',
        3: 'CHEMISTRY',
        4: 'ENGLISH',
        5: 'BIOLOGY',
        6: 'HISTORY',
        7: 'GEOGRAPHY'
    };

    return subjectMap[id] || '';
};
function getSubjectName(subjectCode: string) {
    const subjectNames: { [key: string]: string | null } = {
        MATHEMATICS: 'Toán học',
        ENGLISH: 'Tiếng anh',
        PHYSICS: 'Vật lí',
        CHEMISTRY: 'Hóa học',
        BIOLOGY: 'Sinh học',
        HISTORY: 'Lịch sử',
        GEOGRAPHY: 'Địa lý'
    };

    return subjectNames[subjectCode] || null;
}
const ExamHistory: React.FC<ExamHistoryProps> = ({}) => {
    const [exams, setExams] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [selectedSubject, setSelectedSubject] = useState<Selection>(new Set(['0']));
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [avgGrade, setAvgGrade] = useState<any[]>();
    const [times, setTimes] = useState<any[]>();
    const [quantityGrade, setQuantityGrade] = useState<any[]>();
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['id', 'examName', 'subject', 'grade', 'finishTime'])
    );

    const { user } = useUser();
    const { data } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });

    const {
        status,
        error,
        data: examSubmissionData,
        isPreviousData
    } = useQuery({
        queryKey: [
            'examSubmissionData',
            { page, rowsPerPage, statusFilter: Array.from(selectedSubject)[0] as number, filterValue }
        ],
        queryFn: () =>
            examApi.getExamSubmissions(
                filterValue,
                getSubjectNameById(Array.from(selectedSubject)[0] as number),
                page - 1,
                rowsPerPage,
                'finishTime',
                'DESC'
            )
    });
    const { data: examSubmissionStaticData, status: statusStatic } = useQuery({
        queryKey: ['examSubmissionStaticData', { statusFilter: Array.from(selectedSubject)[0] as number }],
        queryFn: () => examApi.getExamSubmissionStatistic(getSubjectNameById(Array.from(selectedSubject)[0] as number))
    });
    useEffect(() => {
        if (examSubmissionStaticData) {
            setAvgGrade(examSubmissionStaticData?.avgGrade);
            setQuantityGrade(examSubmissionStaticData?.quantityGrade);
            setTimes(examSubmissionStaticData?.times);
        }
    }, [examSubmissionStaticData]);
    useEffect(() => {
        if (examSubmissionData?.data) {
            setExams(examSubmissionData?.data);
            setTotalPage(examSubmissionData?.totalPage);
            setTotalRow(examSubmissionData?.totalRow);
        }
    }, [examSubmissionData]);

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
    console.log(avgGrade);
    console.log(times);
    console.log(quantityGrade);

    const renderCell = useCallback((exam: any, columnKey: Key) => {
        const cellValue = exam[columnKey as keyof any];
        switch (columnKey) {
            case 'examName':
                return <Link href={`/exam/${exam?.id}`}>{cellValue}</Link>;
            case 'subject':
                return getSubjectName(cellValue);
            case 'finishTime':
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
            case 'grade':
                return (cellValue as number).toFixed(1);
            default:
                return cellValue;
        }
    }, []);

    if (user?.role === 'ADMIN' || user?.role === 'TEACHER') return <NotFound />;

    if (!data) return <Loader />;
    else {
        if (data[0].id !== 0)
            data.unshift({
                id: 0,
                name: 'Tất cả',
                url: '',
                description: ''
            });
    }
    // if (!examSubmissionData) return <Loader />;
    // if (!examSubmissionStaticData) return <Loader />;
    return (
        <StudentLayout>
            <div className="w-[90%] xl:w-4/5 mx-auto my-8">
                <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                    <div className="flex flex-col gap-4">
                        <div className="sm:flex justify-between gap-3 items-end">
                            <Input
                                color="primary"
                                isClearable
                                className="w-full sm:max-w-[50%] border-1 mb-2 sm:mb-0"
                                placeholder="Tìm kiếm..."
                                startContent={<BsSearch className="text-default-300" />}
                                value={filterValue}
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
                                            Môn học
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        disallowEmptySelection
                                        aria-label="Table Columns"
                                        closeOnSelect={false}
                                        selectionMode="single"
                                        selectedKeys={selectedSubject}
                                        onSelectionChange={setSelectedSubject}
                                    >
                                        {data.map((subject: Subject) => (
                                            <DropdownItem key={subject.id} className="capitalize">
                                                {capitalize(subject.name)}
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

                    <div className="md:grid grid-cols-2 mt-8 gap-4">
                        <div className="">
                            <h3 className="my-4 font-semibold">Thống kê theo tháng</h3>
                            <AvgScoreMonthChart avgGrade={avgGrade} times={times} />
                        </div>

                        <div className="mt-12 md:mt-0">
                            <h3 className="my-4 font-semibold">Thống kê theo điểm số</h3>
                            <QuantityScoreChart quantityGrade={quantityGrade} />
                        </div>
                    </div>
                </Spin>
            </div>
        </StudentLayout>
    );
};

export default ExamHistory;
