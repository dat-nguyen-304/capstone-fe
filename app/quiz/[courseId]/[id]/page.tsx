'use client';

import VideoHeader from '@/components/header/VideoHeader';
import { Button, Pagination } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import VideoList from '@/components/video/VideoList';
import { BsBook, BsQuestionOctagon } from 'react-icons/bs';
import { CiTimer } from 'react-icons/ci';
import Link from 'next/link';
import { FiRotateCw } from 'react-icons/fi';
import { courseApi, examApi, videoApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import TestResultLine from '@/components/test/TestResultLine';
import Loader from '@/components/Loader';

interface QuizProps {
    params: { courseId: number; id: number };
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
const Quiz: React.FC<QuizProps> = ({ params }) => {
    const [openVideoList, setOpenVideoList] = useState(false);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [listVideo, setListVideo] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const showDrawerVideoList = () => {
        setOpenVideoList(true);
    };

    const {
        data: quizData,
        isLoading,
        status
    } = useQuery<any>({
        queryKey: ['quiz-detail-info', { params: params?.id }],
        queryFn: () => examApi.getExamById(params?.id)
    });
    const { data: quizzesData } = useQuery<any>({
        queryKey: ['quiz-by-course', { params: params?.courseId }],
        queryFn: () => examApi.getQuizCourseById(params?.courseId)
    });
    const { data: videosCourse } = useQuery<any>({
        queryKey: ['my-course-videos', { params: params?.courseId }],
        queryFn: () => videoApi.getByCourseId(params?.courseId, 0, 100, 'id', 'ASC')
    });
    const { data: courseData, refetch: courseRefetch } = useQuery<any>({
        queryKey: ['my-course-quiz-detail', { params: params?.courseId }],
        queryFn: () => courseApi.getCourseById(params?.courseId)
    });
    useEffect(() => {
        if (quizzesData?.data || videosCourse?.data) {
            const mergedList = [...(videosCourse?.data || []), ...(quizzesData?.data || [])].sort((a, b) => {
                const aOrder = a.ordinalNumber || a.courseOrder || 0;
                const bOrder = b.ordinalNumber || b.courseOrder || 0;
                return aOrder - bOrder;
            });
            setListVideo(mergedList);
        }
    }, [quizzesData, videosCourse]);

    const {
        data: quizzesSubmission,
        isLoading: examLoading,
        status: examStatus
    } = useQuery<any>({
        queryKey: ['quiz-history-submission-info', { params: params.id, page }],
        queryFn: () => examApi.getExamSubmissionByExamId(params?.id, page - 1, 5)
    });

    useEffect(() => {
        if (quizzesSubmission?.data) {
            setSubmissions(quizzesSubmission.data);
            setTotalPage(quizzesSubmission.totalPage);
            setTotalRow(quizzesSubmission.totalRow);
        }
    }, [quizzesSubmission]);
    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    if (!quizData) return <Loader />;
    return (
        <VideoHeader type="quiz" id={params?.id} course={courseData}>
            <div className="w-[95%] 2xl:w-4/5 mx-auto">
                <div className="relative md:grid grid-cols-10 gap-2 mt-4 mb-16">
                    <div className="col-span-7">
                        <h3 className="mt-8 text-xl font-bold mb-2 truncate2line">{quizData?.name}</h3>
                        <div className="mt-8">
                            <div className="sm:flex gap-2 md:gap-4 items-center ">
                                <p className="flex items-center gap-2 text-xs sm:text-sm md:text-base mt-2 sm:mt-0">
                                    <BsBook className="text-blue-700" />
                                    Bài thi {getSubjectName(quizData?.subject)}
                                </p>
                                <p className="flex items-center gap-2 text-xs sm:text-sm md:text-base mt-2 sm:mt-0">
                                    <BsQuestionOctagon className="text-blue-700" />
                                    Bài thi gồm có {quizData?.questionList?.length} câu hỏi
                                </p>
                                <p className="flex items-center gap-2 text-xs sm:text-sm md:text-base mt-2 sm:mt-0">
                                    <CiTimer className="text-blue-700" />
                                    Thời gian làm bài {quizData?.duration} phút
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
                                        href={`/quiz/${params?.courseId}/${params.id}/practice`}
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
                                              type="quiz"
                                              index={submissions.length - index}
                                              examId={params?.id}
                                              courseId={params?.courseId}
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
                                href={`/quiz/${params?.courseId}/${params.id}/practice`}
                                size="sm"
                                color="primary"
                                className="flex items-center mt-4 gap-2 sm:w-[150px] sm:h-[36px] sm:text-sm"
                            >
                                <span>Làm bài kiểm tra</span>
                            </Button>
                        )}
                        <Button className="block md:hidden mt-4" size="sm" onClick={showDrawerVideoList}>
                            Danh sách bài học
                        </Button>
                    </div>
                    <div className="hidden md:block h-full col-span-3">
                        <VideoList video={listVideo} courseId={params?.courseId} />
                    </div>
                    <Drawer
                        title="Nội dung khóa học"
                        placement="right"
                        width={500}
                        open={openVideoList}
                        onClose={() => setOpenVideoList(false)}
                        className="block md:hidden"
                    >
                        <VideoList isOnDrawer={true} video={listVideo} courseId={params?.courseId} />
                    </Drawer>
                </div>
            </div>
        </VideoHeader>
    );
};

export default Quiz;
