'use client';

import TestHeader from '@/components/header/TestHeader';
import TestItem from '@/components/test/TestItem';
import { Button } from '@nextui-org/react';
import Image from 'next/image';

interface TestProps {}

const Test: React.FC<TestProps> = ({}) => {
    return (
        <>
            <TestHeader />
            <div className="grid grid-cols-10 gap-8 w-[90%] mx-auto relative mt-[60px]">
                <div className="col-span-7 mt-4">
                    <ul>
                        <TestItem />
                        <TestItem />
                        <TestItem />
                        <TestItem />
                        <TestItem />
                    </ul>
                </div>
                <div className="col-span-3 mt-4">
                    <div className="p-4 bg-blue-50 rounded-xl sticky top-[76px]">
                        <span className="">Tóm tắt bài làm</span>
                        <div className="flex items-center my-2">
                            <span className="inline-flex items-center text-xs">
                                <span className="mr-2">Chưa làm</span>
                                <div className="w-[20px] h-[20px] rounded-full border-1 border-blue-500" />
                            </span>
                            <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                                <span className="inline-flex items-center text-xs">
                                    <span className="mr-2">Gán cờ</span>
                                    <div className="w-[20px] h-[20px] rounded-full bg-yellow-500" />
                                </span>
                            </span>
                            <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                                <span className="inline-flex items-center text-xs">
                                    <span className="mr-2">Đã làm</span>
                                    <div className="w-[20px] h-[20px] rounded-full bg-green-500" />
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
                        <div className="mt-2">
                            <span className="text-sm mr-2">Thời gian còn lại</span>
                            <span className="text-sm font-semibold">11:30</span>
                        </div>
                        <Button className="mt-2" color="primary">
                            Nộp bài
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Test;