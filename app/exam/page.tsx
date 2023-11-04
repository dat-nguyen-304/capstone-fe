'use client';

import { useState } from 'react';
import ExamFilter from '@/components/exam/ExamFilter';
import ExamItem from '@/components/exam/ExamItem';
import ExamInfoCard from '@/components/exam/ExamInfoCard';
import StudentLayout from '@/components/header/StudentLayout';

interface ExamListProps {}

const ExamList: React.FC<ExamListProps> = ({}) => {
    const [selectedSubject, setSelectedSubject] = useState(0);

    return (
        <StudentLayout>
            <div className="w-[90%] 2xl:w-4/5 mx-auto my-8">
                <h2 className="text-2xl font-bold">Thư viện đề thi</h2>
                <div className="xl:grid grid-cols-4 relative">
                    <div className="col-span-3">
                        <ExamFilter selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-8 gap-2 sm:gap-4">
                            <ExamItem />
                            <ExamItem />
                            <ExamItem />
                            <ExamItem />
                            <ExamItem />
                            <ExamItem />
                            <ExamItem />
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
