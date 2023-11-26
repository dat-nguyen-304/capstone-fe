'use client';

import { Button, Pagination } from '@nextui-org/react';
import Link from 'next/link';
import { BsArrowLeft, BsBook, BsQuestionOctagon } from 'react-icons/bs';
import { CiTimer } from 'react-icons/ci';
import { FaUserEdit } from 'react-icons/fa';
import { GoCommentDiscussion } from 'react-icons/go';
import { FiRotateCw } from 'react-icons/fi';
import CommentItem from '@/components/video/CommentItem';
import TestResultLine from '@/components/test/TestResultLine';
import StudentLayout from '@/components/header/StudentLayout';
import { examApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ExamDetailProps {
    params: { id: number };
}

function getSubjectName(subjectCode: string) {
    const subjectNames: { [key: string]: string | null } = {
        MATHEMATICS: 'Toán học',
        ENGLISH: 'Tiếng anh',
        PHYSICS: 'Vật lí',
        CHEMISTRY: 'Hóa học',
        BIOLOGY: 'Sinh học',
        HISTORY: 'Lịch sử',
        GEOGRAPHY: 'Địa lý'
    };

    return subjectNames[subjectCode] || null;
}

const ExamDetail: React.FC<ExamDetailProps> = ({ params }) => {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const {
        data: examData,
        isLoading,
        status
    } = useQuery<any>({
        queryKey: ['exam-detail-info'],
        queryFn: () => examApi.getExamById(params?.id)
    });
    const {
        data: examsSubmission,
        isLoading: examLoading,
        status: examStatus
    } = useQuery<any>({
        queryKey: ['exam-submission-info', page],
        queryFn: () => examApi.getExamSubmissionByExamId(params?.id, page - 1, 5)
    });

    useEffect(() => {
        if (examsSubmission?.data) {
            setSubmissions(examsSubmission.data);
            setTotalPage(examsSubmission.totalPage);
            setTotalRow(examsSubmission.totalRow);
        }
    }, [examsSubmission]);
    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };

    if (!examData) return <Loader />;
    return (
        <StudentLayout>
            <div className="w-[90%] 2xl:w-4/5 mx-auto my-8 rounded-lg sm:p-6 md:p-8 sm:border-1 sm:border-gray-200 sm:shadow-md">
                <div
                    onClick={() => router.push('/exam')}
                    className="mb-4 flex items-center gap-2 text-sm cursor-pointer"
                >
                    <BsArrowLeft />
                    <span>Quay lại</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 truncate2line">{examData?.name}</h3>
                <div className="mt-8">
                    <div className="sm:flex gap-2 md:gap-4 items-center ">
                        <p className="flex items-center gap-2 text-xs sm:text-sm md:text-base mt-2 sm:mt-0">
                            <BsBook className="text-blue-700" />
                            Bài thi {getSubjectName(examData?.subject)}
                        </p>
                        <p className="flex items-center gap-2 text-xs sm:text-sm md:text-base mt-2 sm:mt-0">
                            <BsQuestionOctagon className="text-blue-700" />
                            Bài thi gồm có {examData?.questionList?.length} câu hỏi
                        </p>
                        <p className="flex items-center gap-2 text-xs sm:text-sm md:text-base mt-2 sm:mt-0">
                            <CiTimer className="text-blue-700" />
                            Thời gian làm bài {examData?.duration} phút
                        </p>
                    </div>
                </div>
                <h4 className="font-semibold text-sm sm:text-lg mt-5">Kết quả làm bài của bạn</h4>
                {totalRow ? (
                    <ul className="p-3 sm:p-4 rounded-xl border-1 border-blue-500 shadow-xl w-full md:w-4/5 mt-4">
                        <li className="flex items-center justify-between">
                            <span className="text-sm sm:text-base">Đã làm {totalRow || 0} lần</span>
                            <Button
                                as={Link}
                                href={`/exam/${params.id}/practice`}
                                size="sm"
                                color="primary"
                                className="flex items-center gap-2 sm:w-[120px] sm:h-[36px] sm:text-sm"
                            >
                                {totalRow && totalRow > 0 ? (
                                    <>
                                        <FiRotateCw />
                                        <span>Làm lại</span>
                                    </>
                                ) : (
                                    <span>Làm bài kiểm tra</span>
                                )}
                            </Button>
                        </li>
                        {submissions?.length
                            ? submissions?.map((examsSubmissionInfo: any, index: number) => (
                                  <TestResultLine
                                      key={index}
                                      type="exam"
                                      index={index}
                                      examId={params?.id}
                                      examsSubmissionInfo={examsSubmissionInfo}
                                  />
                              ))
                            : null}
                        {totalPage && totalPage > 1 ? (
                            <div className="flex justify-center mb-16">
                                <Pagination
                                    page={page}
                                    total={totalPage}
                                    onChange={value => scrollToTop(value)}
                                    showControls
                                />
                            </div>
                        ) : null}
                    </ul>
                ) : (
                    <Button
                        as={Link}
                        href={`/exam/${params.id}/practice`}
                        size="sm"
                        color="primary"
                        className="flex items-center mt-4 gap-2 sm:w-[150px] sm:h-[36px] sm:text-sm"
                    >
                        <span>Làm bài kiểm tra</span>
                    </Button>
                )}
            </div>
            {/* <div className="w-[90%] 2xl:w-4/5 mx-auto my-8 rounded-lg sm:p-6 md:p-8 sm:border-1 sm:border-gray-200 sm:shadow-md">
                <h3 className="text-lg font-bold mb-2">Bình luận</h3>
                <ul className="px-0 sm:px-4">
                    <CommentItem />
                    <CommentItem />
                    <CommentItem />
                </ul>
                <Button className="w-full">Xem thêm</Button>
            </div> */}
        </StudentLayout>
    );
};

export default ExamDetail;
