'use client';

import ExamFilter from '@/components/exam/ExamFilter';
import ExamItem from '@/components/exam/ExamItem';

import { Button, Card } from '@nextui-org/react';
import { PiTarget } from 'react-icons/pi';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { SiGoogleanalytics } from 'react-icons/si';
import { CiPaperplane } from 'react-icons/ci';
import ExamInfoCard from '@/components/exam/ExamInfoCard';

interface ExamListProps {}

const ExamList: React.FC<ExamListProps> = ({}) => {
    const [selectedSubject, setSelectedSubject] = useState(0);

    return (
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
    );
};

export default ExamList;
