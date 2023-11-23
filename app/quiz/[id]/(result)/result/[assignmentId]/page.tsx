'use client';

import TestResultItem from '@/components/test/TestResultItem';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';

interface ResultQuizProps {}

const ResultQuiz: React.FC<ResultQuizProps> = ({}) => {
    return (
        <>
            <div className="xl:grid grid-cols-10 gap-8 w-[90%] mx-auto relative mt-[80px] xl:mt-[60px]">
                <div className="col-span-7 mt-4">
                    <ul>
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
                            <li className="flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-blue-500 border-1">
                                1
                            </li>
                            <li className="flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-blue-500 border-1">
                                10
                            </li>
                            <li className="flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-blue-500 border-1">
                                10
                            </li>
                            <li className="flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-blue-500 border-1">
                                10
                            </li>
                            <li className="flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-blue-500 border-1">
                                10
                            </li>
                            <li className="flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-blue-500 border-1">
                                10
                            </li>
                            <li className="flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-blue-500 border-1">
                                10
                            </li>
                            <li className="flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-blue-500 border-1">
                                10
                            </li>
                            <li className="flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-blue-500 border-1">
                                10
                            </li>
                            <li className="flex justify-center items-center w-[32px] h-[32px] rounded-full text-xs border-blue-500 border-1">
                                10
                            </li>
                        </ul>
                        <Button className="mt-4" size="sm" variant="bordered" color="primary">
                            <Link href="/quiz/1" className="flex items-center">
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

export default ResultQuiz;
