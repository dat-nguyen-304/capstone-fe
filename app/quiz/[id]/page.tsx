'use client';

import VideoHeader from '@/components/header/VideoHeader';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { Drawer } from 'antd';
import VideoList from '@/components/video/VideoList';
import { BsQuestionOctagon } from 'react-icons/bs';
import { CiTimer } from 'react-icons/ci';
import Link from 'next/link';
import TestResultLine from '@/components/test/TestResultLine';
import { FiRotateCw } from 'react-icons/fi';

interface QuizProps {}

const Quiz: React.FC<QuizProps> = ({}) => {
    const [openVideoList, setOpenVideoList] = useState(false);
    const showDrawerVideoList = () => {
        setOpenVideoList(true);
    };
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    return (
        <>
            <VideoHeader />
            <div className="w-[95%] 2xl:w-4/5 mx-auto">
                <div className="relative md:grid grid-cols-10 gap-2 mt-4 mb-16">
                    <div className="col-span-7">
                        <h3 className="mt-8 text-xl font-bold mb-2 truncate2line">Luyện tập abcxyz</h3>
                        <div className="mt-8">
                            <div className="sm:flex gap-2 md:gap-4 items-center ">
                                <p className="flex items-center gap-2 text-xs sm:text-sm md:text-base mt-2 sm:mt-0">
                                    <BsQuestionOctagon className="text-blue-700" />
                                    Bài thi gồm có 50 câu hỏi
                                </p>
                                <p className="flex items-center gap-2 text-xs sm:text-sm md:text-base mt-2 sm:mt-0">
                                    <CiTimer className="text-blue-700" />
                                    Thời gian làm bài 60 phút
                                </p>
                            </div>
                            <h4 className="mt-2 text-sm sm:text-base font-semibold">Nội dung:</h4>
                            <p className="text-xs sm:text-sm">{defaultContent}</p>
                        </div>
                        <Button as={Link} href="/quiz/1/practice" className="mt-8" color="primary">
                            Làm bài
                        </Button>
                        <h4 className="mt-4 text-sm sm:text-base font-semibold">Lịch sử làm bài:</h4>
                        <ul className="p-3 sm:p-4 rounded-xl border-1 border-blue-500 shadow-xl w-full md:w-[90%] mt-2">
                            <li className="flex items-center justify-between">
                                <span className="text-sm sm:text-base">Đã làm 1 lần</span>
                                <Button
                                    as={Link}
                                    href="/exam/1/practice"
                                    size="sm"
                                    color="primary"
                                    className="flex items-center gap-4"
                                >
                                    <FiRotateCw />
                                    <span>Làm lại</span>
                                </Button>
                            </li>
                            <TestResultLine type="quiz" />
                            <TestResultLine type="quiz" />
                            <TestResultLine type="quiz" />
                        </ul>
                        <Button className="block md:hidden mt-4" size="sm" onClick={showDrawerVideoList}>
                            Danh sách bài học
                        </Button>
                    </div>
                    <div className="hidden md:block h-full col-span-3">
                        <VideoList />
                    </div>
                    <Drawer
                        title="Nội dung khóa học"
                        placement="right"
                        width={500}
                        open={openVideoList}
                        onClose={() => setOpenVideoList(false)}
                        className="block md:hidden"
                    >
                        <VideoList isOnDrawer={true} />
                    </Drawer>
                </div>
            </div>
        </>
    );
};

export default Quiz;
