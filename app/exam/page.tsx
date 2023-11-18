'use client';
import { useEffect, useState } from 'react';
import ExamFilter from '@/components/exam/ExamFilter';
import ExamItem from '@/components/exam/ExamItem';
import ExamInfoCard from '@/components/exam/ExamInfoCard';
import StudentLayout from '@/components/header/StudentLayout';
import { useUser } from '@/hooks';
import NotFound from '../not-found';
import { examApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { ExamCardType } from '@/types';

interface ExamListProps {}

const ExamList: React.FC<ExamListProps> = ({}) => {
    const { user } = useUser();

    const [selectedSubject, setSelectedSubject] = useState(0);

    const [exams, setExams] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const { status, error, data, isPreviousData } = useQuery({
        queryKey: ['exams', { page }],
        // keepPreviousData: true,
        queryFn: () => examApi.getAll('ALL', page - 1, 20)
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

    if (user?.role === 'ADMIN' || user?.role === 'TEACHER') return <NotFound />;
    return (
        <StudentLayout>
            <div className="w-[90%] 2xl:w-4/5 mx-auto my-8">
                <h2 className="text-2xl font-bold">Thư viện đề thi</h2>
                <div className="xl:grid grid-cols-4 relative">
                    <div className="col-span-3">
                        <ExamFilter selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-8 gap-2 sm:gap-4">
                            {exams.length ? (
                                exams.map((examItem: ExamCardType) => <ExamItem key={examItem.id} exam={examItem} />)
                            ) : (
                                <></>
                            )}
                            {/* <ExamItem />
                            <ExamItem />
                            <ExamItem />
                            <ExamItem />
                            <ExamItem />
                            <ExamItem />
                            <ExamItem /> */}
                        </ul>
                    </div>
                    <div className="col-span-1 hidden xl:block ml-auto w-[90%] ">
                        <ExamInfoCard />
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default ExamList;
