'use client';

import { examApi } from '@/api-client';
import DoTestItem from '@/components/test/DoTestItem';
import { QuestionType } from '@/types';
import { Button } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
interface DoExamProps {
    params: { id: number };
}

const formatTime = (seconds: number | null): string => {
    if (seconds === null || seconds <= 0) {
        return '00:00:00';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const DoExam: React.FC<DoExamProps> = ({ params }) => {
    const router = useRouter();
    const [questions, setQuestions] = useState<any[]>([]);
    const [totalQuestion, setTotalQuestion] = useState<number>();
    const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const [examSubmitted, setExamSubmitted] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<{ questionId: number; selection: string }[]>([]);
    // const { data, isLoading, status } = useQuery<any>({
    //     queryKey: ['exam-detail'],
    //     queryFn: () => examApi.getExamById(params?.id)
    // });

    useEffect(() => {
        const createAttempt = async () => {
            try {
                const res = await examApi.createAttempt(params?.id);
                console.log(res);
                const data = res.data;
                if (data) {
                    setQuestions(data?.selectionList);
                    setTotalQuestion(data?.selectionList?.length);
                    const durationInSeconds = (data?.duration || 60) * 60;
                    setRemainingTime(durationInSeconds);
                }
                // Handle the response if needed
            } catch (error) {
                // Handle error
            }
        };

        if (params?.id) {
            createAttempt();
        }
    }, [params?.id]);

    // useEffect(() => {
    //     if (data) {
    //         setQuestions(data?.questionList);
    //         setTotalQuestion(data?.questionList?.length);
    //         const durationInSeconds = (data?.duration || 0) * 60;
    //         setRemainingTime(durationInSeconds);
    //     }
    // }, [data]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (remainingTime !== null && remainingTime > 0) {
            // Update the remaining time every second
            timer = setInterval(() => {
                setRemainingTime(prev => (prev !== null ? prev - 1 : null));
            }, 1000);
        }

        // Clear the interval when the component unmounts or when the remaining time reaches 0
        return () => clearInterval(timer);
    }, [remainingTime]);

    const handleAnswer = (index: number, selection: string) => {
        const updatedAnswers = [...selectedAnswers];
        const questionId = questions[index]?.question?.id; // Assuming there's a questionId property in your data

        const existingAnswerIndex = updatedAnswers.findIndex(answer => answer.questionId === questionId);

        if (existingAnswerIndex !== -1) {
            // Update the existing answer
            updatedAnswers[existingAnswerIndex] = { questionId, selection };
        } else {
            // Add a new answer
            updatedAnswers.push({ questionId, selection });
        }

        setSelectedAnswers(updatedAnswers);
        setAnsweredQuestions(prev => [...prev, index]);
    };
    const handleSubmitExam = async () => {
        // Call your API to submit the exam with selected answers
        try {
            setExamSubmitted(true);
            console.log(selectedAnswers);

            const res = await examApi.submitExam(params?.id, selectedAnswers);

            console.log(res);
            if (res) {
                router?.push(`/exam/${params?.id}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="xl:grid grid-cols-10 gap-8 w-[90%] mx-auto relative mt-[80px] xl:mt-[60px]">
                <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                    <div className="col-span-7 mt-4">
                        <ul>
                            {totalQuestion ? (
                                questions?.map((questions: any, index: number) => (
                                    <DoTestItem
                                        key={index}
                                        questions={questions}
                                        index={index}
                                        onAnswer={handleAnswer}
                                    />
                                ))
                            ) : (
                                <></>
                            )}
                        </ul>
                    </div>
                    <div className="col-span-3 my-4">
                        <div className="p-4 bg-blue-50 rounded-xl sticky top-[76px]">
                            <span className="">Tóm tắt bài làm</span>
                            <div className="flex items-center my-2 justify-between sm:justify-normal">
                                <span className="inline-flex items-center text-xs">
                                    <span className="mr-2">Chưa làm</span>
                                    <div className="w-[20px] h-[20px] rounded-full border-1 border-blue-500" />
                                </span>
                                <span className="sm:before:content-['•'] sm:before:inline-block sm:before:text-gray-500 sm:before:mx-2">
                                    <span className="inline-flex items-center text-xs">
                                        <span className="mr-2">Gán cờ</span>
                                        <div className="w-[20px] h-[20px] rounded-full bg-yellow-500" />
                                    </span>
                                </span>
                                <span className="sm:before:content-['•'] sm:before:inline-block sm:before:text-gray-500 sm:before:mx-2">
                                    <span className="inline-flex items-center text-xs">
                                        <span className="mr-2">Đã làm</span>
                                        <div className="w-[20px] h-[20px] rounded-full bg-green-500" />
                                    </span>
                                </span>
                            </div>
                            <ul className="flex gap-2 flex-wrap mt-2">
                                {totalQuestion &&
                                    Array.from({ length: totalQuestion }).map((_, index) => (
                                        <li
                                            key={index}
                                            className={`flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-blue-500 border-1 ${
                                                answeredQuestions.includes(index) ? 'bg-green-500' : ''
                                            }`}
                                        >
                                            {index + 1}
                                        </li>
                                    ))}
                            </ul>
                            <div className="mt-2">
                                <span className="text-sm mr-2">Thời gian còn lại</span>
                                <span className="text-sm font-semibold">{formatTime(remainingTime)}</span>
                            </div>
                            <Button
                                className="mt-2"
                                color="primary"
                                onClick={handleSubmitExam}
                                // disabled={examSubmitted}
                            >
                                {/* <Link href="/exam/1">Nộp bài</Link> */}
                                Nộp bài
                            </Button>
                        </div>
                    </div>
                </Spin>
            </div>
        </>
    );
};

export default DoExam;
