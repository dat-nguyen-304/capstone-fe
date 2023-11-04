'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { BsArrowLeft, BsBook, BsQuestionOctagon } from 'react-icons/bs';
import { CiTimer } from 'react-icons/ci';
import { FaUserEdit } from 'react-icons/fa';
import { GoCommentDiscussion } from 'react-icons/go';
import { FiRotateCw } from 'react-icons/fi';
import CommentItem from '@/components/video/CommentItem';
import TestResultLine from '@/components/test/TestResultLine';
import StudentLayout from '@/components/header/StudentLayout';

interface ExamDetailProps {}

const ExamDetail: React.FC<ExamDetailProps> = ({}) => {
    return (
        <StudentLayout>
            <div className="w-[90%] 2xl:w-4/5 mx-auto my-8 rounded-lg sm:p-6 md:p-8 sm:border-1 sm:border-gray-200 sm:shadow-md">
                <Link href="/exam" className="mb-4 flex items-center gap-2 text-sm">
                    <BsArrowLeft />
                    <span>Quay lại</span>
                </Link>
                <h3 className="text-2xl font-bold mb-2 truncate2line">Đề thi thử môn toán BGD & ĐT</h3>
                <div className="mt-8">
                    <div className="sm:flex gap-2 md:gap-4 items-center ">
                        <p className="flex items-center gap-2 text-xs sm:text-sm md:text-base mt-2 sm:mt-0">
                            <BsBook className="text-blue-700" />
                            Bài thi Toán học
                        </p>
                        <p className="flex items-center gap-2 text-xs sm:text-sm md:text-base mt-2 sm:mt-0">
                            <BsQuestionOctagon className="text-blue-700" />
                            Bài thi gồm có 50 câu hỏi
                        </p>
                        <p className="flex items-center gap-2 text-xs sm:text-sm md:text-base mt-2 sm:mt-0">
                            <CiTimer className="text-blue-700" />
                            Thời gian làm bài 60 phút
                        </p>
                    </div>
                    <div className="flex gap-4 items-center mt-2 sm:mt-3">
                        <p className="flex items-center gap-2 text-xs sm:text-base ">
                            <FaUserEdit className="text-blue-700" />
                            50.000 đã làm đề thi này
                        </p>
                        <p className="flex items-center gap-2 text-xs sm:text-base">
                            <GoCommentDiscussion className="text-blue-700" />
                            10.000 bình luận
                        </p>
                    </div>
                </div>
                <h4 className="font-semibold text-sm sm:text-lg mt-5">Kết quả làm bài của bạn</h4>
                <ul className="p-3 sm:p-4 rounded-xl border-1 border-blue-500 shadow-xl w-full md:w-4/5 mt-4">
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
                    <TestResultLine type="exam" />
                    <TestResultLine type="exam" />
                    <TestResultLine type="exam" />
                    <TestResultLine type="exam" />
                </ul>
            </div>
            <div className="w-[90%] 2xl:w-4/5 mx-auto my-8 rounded-lg sm:p-6 md:p-8 sm:border-1 sm:border-gray-200 sm:shadow-md">
                <h3 className="text-lg font-bold mb-2">Bình luận</h3>
                <ul className="px-0 sm:px-4">
                    <CommentItem />
                    <CommentItem />
                    <CommentItem />
                </ul>
                <Button className="w-full">Xem thêm</Button>
            </div>
        </StudentLayout>
    );
};

export default ExamDetail;
