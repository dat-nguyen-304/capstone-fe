'use client';
import { useEffect, useState } from 'react';
import ExamFilter from '@/components/exam/ExamFilter';
import ExamItem from '@/components/exam/ExamItem';
import ExamInfoCard from '@/components/exam/ExamInfoCard';
import { useUser } from '@/hooks';

import { examApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { ExamCardType } from '@/types';
import { Spin } from 'antd';
import NotFound from '@/app/not-found';
import StudentLayout from '@/components/header/StudentLayout';

interface ExamListProps {}
const getSubjectNameById = (id: number): string => {
    if (id == 1) {
        return 'MATHEMATICS';
    } else if (id == 2) {
        return 'PHYSICS';
    } else if (id == 3) {
        return 'CHEMISTRY';
    } else if (id == 4) {
        return 'ENGLISH';
    } else if (id == 5) {
        return 'BIOLOGY';
    } else if (id == 6) {
        return 'HISTORY';
    } else if (id == 7) {
        return 'GEOGRAPHY';
    } else {
        return '';
    }
};
const ExamList: React.FC<ExamListProps> = ({}) => {
    const { user } = useUser();

    const [selectedSubject, setSelectedSubject] = useState(0);
    const [selectedFilterSort, setSelectedFilterSort] = useState(0);
    const [exams, setExams] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState<string>('');
    const { status, error, data, isPreviousData } = useQuery({
        queryKey: ['exams', { page, selectedSubject, selectedFilterSort, search }],
        // keepPreviousData: true,
        queryFn: () =>
            examApi.getAllExamFilter(
                search,
                selectedFilterSort == 2 ? 'false' : selectedFilterSort == 3 ? 'true' : '',
                getSubjectNameById(selectedSubject),
                'PUBLIC_EXAM',
                page - 1,
                20,
                selectedFilterSort == 1 ? 'createTime' : 'id',
                selectedFilterSort == 1 ? 'DESC' : 'ASC'
            )
    });
    console.log(search);

    useEffect(() => {
        if (data?.data) {
            setExams(data.data);
            setTotalPage(data?.totalPage);
            setTotalRow(data?.totalRow);
        }
    }, [data, selectedSubject, selectedFilterSort, search]);
    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };
    console.log(data);

    if (user?.role === 'ADMIN' || user?.role === 'TEACHER') return <NotFound />;

    return (
        <StudentLayout>
            <div className="w-[90%] 2xl:w-4/5 mx-auto my-8">
                <h2 className="text-2xl text-blue-500 font-bold">Thư viện đề thi</h2>
                <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                    <div className="relative">
                        <div>
                            <ExamFilter
                                selectedSubject={selectedSubject}
                                setSelectedSubject={setSelectedSubject}
                                setSelectedFilterSort={setSelectedFilterSort}
                                setSearch={setSearch}
                            />
                            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 mt-8 gap-2 sm:gap-4">
                                {exams?.length ? (
                                    exams?.map((examItem: ExamCardType) => (
                                        <ExamItem key={examItem?.id} exam={examItem} />
                                    ))
                                ) : (
                                    <div>Chưa có bài thi</div>
                                )}
                            </ul>
                        </div>
                    </div>
                </Spin>
            </div>
        </StudentLayout>
    );
};

export default ExamList;
