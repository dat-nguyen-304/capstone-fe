'use client';

import { examApi } from '@/api-client';
import Loader from '@/components/Loader';
import SubmissionStatisticModal from '@/components/exam/SubmissionStatisticModal';
import TestResultItem from '@/components/test/TestResultItem';
import { Button, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { RefObject, createRef, useEffect, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { SiGoogleanalytics } from 'react-icons/si';

interface ResultExamProps {
    params: {
        id: number;
        assignmentId: number;
    };
}

const ResultQuiz: React.FC<ResultExamProps> = ({ params }) => {
    const router = useRouter();
    const [questions, setQuestions] = useState<any[]>([]);
    const [totalQuestion, setTotalQuestion] = useState<number>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        data: examSubmissionData,
        isLoading,
        status
    } = useQuery<any>({
        queryKey: ['quiz-submission-info', { params: params?.id }],
        queryFn: () => examApi.getExamSubmissionById(params?.assignmentId)
    });
    const { data: SubmissionStatisticData } = useQuery<any>({
        queryKey: ['quiz-submission-statistic', { params: params.id }],
        queryFn: () => examApi.getSubmissionStatisticBySubId(params?.assignmentId)
    });

    useEffect(() => {
        if (examSubmissionData) {
            setQuestions(examSubmissionData?.selectionList);
            setTotalQuestion(examSubmissionData?.selectionList?.length);
        }
    }, [examSubmissionData]);
    const questionRefs: RefObject<HTMLLIElement>[] = questions.map(() => createRef());
    const scrollToQuestion = (questionId: number) => {
        const element = questionRefs[questionId - 1]?.current;

        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            const elementPosition = element.getBoundingClientRect().top;
            window.scrollBy({
                top: elementPosition - 80,
                behavior: 'smooth'
            });
        }
    };
    if (!examSubmissionData) return <Loader />;
    return (
        <>
            <div className="xl:grid grid-cols-10 gap-8 w-[90%] mx-auto relative mt-[80px] xl:mt-[60px]">
                <div className="col-span-7 mt-4" suppressContentEditableWarning={true}>
                    <ul>
                        {totalQuestion ? (
                            questions?.map((questions: any, index: number) => (
                                <TestResultItem
                                    key={index}
                                    questions={questions}
                                    index={index}
                                    ref={questionRefs[index]}
                                />
                            ))
                        ) : (
                            <>Empty List Question</>
                        )}
                    </ul>
                </div>
                <div className="col-span-3 my-4">
                    <div className="p-4 bg-blue-50 rounded-xl sticky top-[76px]">
                        <span className="">Tóm tắt bài làm</span>
                        <div className="flex items-center my-2 gap-4 sm:gap-0 justify-normal">
                            <span className="inline-flex items-center text-xs">
                                <span className="mr-2">Đúng</span>
                                <div className="w-[20px] h-[20px] rounded-full bg-green-500" />
                            </span>
                            <span className="sm:before:content-['•'] sm:before:inline-block sm:before:text-gray-500 sm:before:mx-2">
                                <span className="inline-flex items-center text-xs">
                                    <span className="mr-2">Sai</span>
                                    <div className="w-[20px] h-[20px] rounded-full bg-red-400" />
                                </span>
                            </span>
                        </div>
                        <ul className="flex gap-2 flex-wrap mt-2">
                            {totalQuestion &&
                                Array.from({ length: totalQuestion }).map((_, index) => (
                                    <li
                                        onClick={() => scrollToQuestion(index + 1)}
                                        key={index}
                                        className={`cursor-pointer flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-1 ${
                                            questions[index]?.selectedAnswer ===
                                            questions[index]?.question?.correctAnswer
                                                ? 'bg-green-500  text-white'
                                                : questions[index]?.selectedAnswer === null
                                                ? 'bg-gray-500  text-white'
                                                : 'bg-red-400 text-white'
                                        }`}
                                    >
                                        {index + 1}
                                    </li>
                                ))}
                        </ul>
                        <Button
                            onClick={() => router.back()}
                            className="mt-4"
                            size="sm"
                            variant="bordered"
                            color="primary"
                        >
                            <div className="flex items-center">
                                <BsArrowLeft />
                                <span className="ml-1">Quay lại</span>
                            </div>
                        </Button>
                        <Button onClick={onOpen} className="mt-4 mx-2" size="sm" variant="bordered" color="primary">
                            <div className="flex items-center">
                                <SiGoogleanalytics />
                                <span className="ml-1">Thông kê</span>
                            </div>
                        </Button>
                    </div>
                    <SubmissionStatisticModal
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                        submission={SubmissionStatisticData}
                    />
                </div>
            </div>
        </>
    );
};

export default ResultQuiz;
