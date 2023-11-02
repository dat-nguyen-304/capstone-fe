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
    SortDescriptor
} from '@nextui-org/react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
import TableContent from '@/components/table';
import { useQuery } from '@tanstack/react-query';
import { subjectApi } from '@/api-client';
import { Subject } from '@/types';
import Loader from '@/components/Loader';
import AvgScoreMonthChart from '@/components/chart/exam-history/AvgScoreMonthChart';
import QuantityScoreChart from '@/components/chart/exam-history/QuantityScoreChart';

interface ExamHistoryProps {}

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN BÀI THI', uid: 'name', sortable: true },
    { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'ĐIỂM SỐ', uid: 'score', sortable: true },
    { name: 'NGÀY', uid: 'date', sortable: true }
];

const exams = [
    {
        id: 1,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        score: 5,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 2,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        score: 6,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 3,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        score: 8,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 4,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        score: 6,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 5,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        score: 8,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 6,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        score: 7,
        date: '12/12/2023 08:02:02'
    }
];

type Exam = (typeof exams)[0];

const ExamHistory: React.FC<ExamHistoryProps> = ({}) => {
    const { data } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll
    });
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(['id', 'name', 'subject', 'score', 'date'])
    );
    const [selectedSubject, setSelectedSubject] = useState<Selection>(new Set(['0']));
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

    const renderCell = useCallback((exam: Exam, columnKey: Key) => {
        const cellValue = exam[columnKey as keyof Exam];
        switch (columnKey) {
            case 'name':
                return <Link href={`/exam/${1}`}>{cellValue}</Link>;
            default:
                return cellValue;
        }
    }, []);

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

    return (
        <>
            <Header />
            <div className="w-[90%] xl:w-4/5 mx-auto my-8">
                <div className="flex flex-col gap-4">
                    <div className="sm:flex justify-between gap-3 items-end">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[50%] border-1 mb-2 sm:mb-0"
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
                                    <Button
                                        endContent={<BsChevronDown className="text-small" />}
                                        size="sm"
                                        variant="flat"
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
                            <Dropdown>
                                <DropdownTrigger className="flex">
                                    <Button
                                        endContent={<BsChevronDown className="text-small" />}
                                        size="sm"
                                        variant="flat"
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
                        <span className="text-default-400 text-xs sm:text-sm">Tìm thấy {exams.length} kết quả</span>
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
                    items={exams}
                    page={page}
                    setPage={setPage}
                    sortDescriptor={sortDescriptor}
                    setSortDescriptor={setSortDescriptor}
                />
                <div className="md:grid grid-cols-2 mt-8 gap-4">
                    <div className="">
                        <h3 className="my-4 font-semibold">Thống kê theo tháng</h3>
                        <AvgScoreMonthChart />
                    </div>

                    <div className="mt-12 md:mt-0">
                        <h3 className="my-4 font-semibold">Thống kê theo điểm số</h3>
                        <QuantityScoreChart />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ExamHistory;
