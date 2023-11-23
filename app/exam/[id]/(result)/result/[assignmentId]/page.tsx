'use client';

import { examApi } from '@/api-client';
import Loader from '@/components/Loader';
import TestResultItem from '@/components/test/TestResultItem';
import { Button } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';

interface ResultExamProps {
    params: {
        id: number;
        assignmentId: number;
    };
}

const ResultExam: React.FC<ResultExamProps> = ({ params }) => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [totalQuestion, setTotalQuestion] = useState<number>();
    const {
        data: examSubmissionData,
        isLoading,
        status
    } = useQuery<any>({
        queryKey: ['exam-submission-info'],
        queryFn: () => examApi.getExamSubmissionById(params?.assignmentId)
    });
    console.log(examSubmissionData);
    useEffect(() => {
        if (examSubmissionData) {
            setQuestions(examSubmissionData?.selectionList);
            setTotalQuestion(examSubmissionData?.selectionList?.length);
        }
    }, [examSubmissionData]);
    if (!examSubmissionData) return <Loader />;
    return (
        <>
            <div className="xl:grid grid-cols-10 gap-8 w-[90%] mx-auto relative mt-[80px] xl:mt-[60px]">
                <div className="col-span-7 mt-4" suppressContentEditableWarning={true}>
                    <ul>
                        {totalQuestion ? (
                            questions?.map((questions: any, index: number) => (
                                <TestResultItem key={index} questions={questions} index={index} />
                            ))
                        ) : (
                            <>Empty List Question</>
                        )}
                        {/* <TestResultItem />
                        <TestResultItem />
                        <TestResultItem />
                        <TestResultItem />
                        <TestResultItem />
                        <TestResultItem />
                        <TestResultItem /> */}
                    </ul>
                </div>
                <div className="col-span-3 my-4">
                    <div className="p-4 bg-blue-50 rounded-xl sticky top-[76px]">
                        <span className="">Tóm tắt bài làm</span>
                        <div className="flex items-center my-2 justify-between sm:justify-normal">
                            <span className="inline-flex items-center text-xs">
                                <span className="mr-2">Đúng</span>
                                <div className="w-[20px] h-[20px] rounded-full bg-green-500" />
                            </span>
                            <span className="sm:before:content-['•'] sm:before:inline-block sm:before:text-gray-500 sm:before:mx-2">
                                <span className="inline-flex items-center text-xs">
                                    <span className="mr-2">Sai</span>
                                    <div className="w-[20px] h-[20px] rounded-full bg-red-500" />
                                </span>
                            </span>
                        </div>
                        <ul className="flex gap-2 flex-wrap mt-2">
                            {totalQuestion &&
                                Array.from({ length: totalQuestion }).map((_, index) => (
                                    <li
                                        key={index}
                                        className={`flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-1 ${
                                            questions[index]?.selectedAnswer ===
                                            questions[index]?.question?.correctAnswer
                                                ? 'bg-green-500  text-white'
                                                : questions[index]?.selectedAnswer === null
                                                ? 'bg-gray-500  text-white'
                                                : 'bg-red-500 text-white'
                                        }`}
                                    >
                                        {index + 1}
                                    </li>
                                ))}
                        </ul>
                        <Button className="mt-4" size="sm" variant="bordered" color="primary">
                            <Link href={`/exam/${params?.id}`} className="flex items-center">
                                <BsArrowLeft />
                                <span className="ml-1">Quay lại</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResultExam;
