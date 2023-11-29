'use client';

import { Button, Card, Link, Pagination, Select, SelectItem, Skeleton, Tooltip, User } from '@nextui-org/react';
import StudentLayout from '@/components/header/StudentLayout';
import { combinationApi, examApi, studentApi, subjectApi, suggestApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Combination, Subject } from '@/types';
import TestResultLine from '@/components/test/TestResultLine';
import { BsBookFill, BsClockFill } from 'react-icons/bs';
import { FaUserEdit } from 'react-icons/fa';
import CourseCard from '@/components/course/CourseCard';
import { useUser } from '@/hooks';
import { createSkeletonArray } from '@/utils';
import { MdVerified } from 'react-icons/md';

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
const getSubjectNameById = (id: number): string => {
    const subjectMap: Record<number, string> = {
        1: 'MATHEMATICS',
        2: 'PHYSICS',
        3: 'CHEMISTRY',
        4: 'ENGLISH',
        5: 'BIOLOGY',
        6: 'HISTORY',
        7: 'GEOGRAPHY'
    };

    return subjectMap[id] || '';
};
const getSubjectIdByName = (subject: string): number => {
    const subjectMap: Record<string, number> = {
        MATHEMATICS: 1,
        PHYSICS: 2,
        CHEMISTRY: 3,
        ENGLISH: 4,
        BIOLOGY: 5,
        HISTORY: 6,
        GEOGRAPHY: 7
    };

    return subjectMap[subject] || 0;
};

const ExamDetail: React.FC<ExamDetailProps> = ({ params }) => {
    const { user } = useUser();
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState<number>(1);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [selectedCombination, setSelectedCombination] = useState<string | null>(null);
    const [isCreatingTarget, setIsCreatingTarget] = useState(false);
    const [showCombination, setShowCombination] = useState(true);
    const [showEntranceExam, setShowEntranceExam] = useState(false);
    const [alreadyDoEntranceExam, setAlreadyDoEntranceExam] = useState(false);
    const [entranceExamCombination, setEntranceExamCombination] = useState<any[]>([]);
    const [courseCombination, setCourseCombination] = useState<any[]>([]);
    const { data: subjectsData } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });

    const { data: targetData, isLoading } = useQuery({
        queryKey: ['targets'],
        queryFn: studentApi.getTarget,
        staleTime: Infinity
    });

    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>(subjectsData || []);
    const [filteredSubjectsDone, setFilteredSubjectsDone] = useState<Subject[]>(subjectsData || []);
    const handleCombinationClick = (combinationName: string) => {
        setSelectedCombination(combinationName);
    };

    const handleSelectButtonClick = () => {
        // Check if the selected combination exists in targetData.map
        const combinationExists = targetData?.some(
            (targetCombination: any) => targetCombination.name === selectedCombination
        );

        if (combinationExists) {
            const subjectTargetResponses = targetData.find(
                (targetCombination: any) => targetCombination.name === selectedCombination
            )?.subjectTargetResponses;

            if (subjectTargetResponses && subjectTargetResponses.length === 3) {
                // const subjectIds = subjectTargetResponses.map((response: any) => response.subjectId);
                const subjectIds =
                    targetData
                        .find((targetCombination: any) => targetCombination.name === selectedCombination)
                        ?.subjectTargetResponses?.map((response: any) => response.subjectId) || [];

                setFilteredSubjects(subjectsData?.filter(subject => subjectIds.includes(subject.id)) || []);
                setShowEntranceExam(true);
                setShowCombination(false);
            } else {
                console.log();

                setIsCreatingTarget(true);
                setShowCombination(false);
            }
        } else {
            // The combination does not exist, prompt the user to create a target
            setIsCreatingTarget(true);
            setShowCombination(false);
        }
    };

    const getEntranceExamByCombination = async () => {
        const subject1 = getSubjectNameById(filteredSubjects[0]?.id || 1);
        const subject2 = getSubjectNameById(filteredSubjects[1]?.id || 2);
        const subject3 = getSubjectNameById(filteredSubjects[2]?.id || 3);

        try {
            const response = await examApi.getEntranceExamByCombination(subject1, subject2, subject3);

            const hasDoneAttempt = response.some((exam: any) => exam?.attemptStatus === 'DONE');

            const doneSubjects = response
                .filter((exam: any) => exam?.attemptStatus === 'DONE')
                .map((exam: any) => getSubjectIdByName(exam?.subject));

            setFilteredSubjectsDone(subjectsData?.filter(subject => doneSubjects?.includes(subject?.id)) || []);
            // Update filteredSubjectsDone with the filtered subjects

            setAlreadyDoEntranceExam(hasDoneAttempt);
            setEntranceExamCombination(response);
            // console.log(response);
        } catch (error) {
            // Handle API error
            console.error(error);
        }
    };
    const getSuggestCourseCombination = async () => {
        const subject1 = filteredSubjectsDone[0]?.id || 0;
        const subject2 = filteredSubjectsDone[1]?.id || 0;
        const subject3 = filteredSubjectsDone[2]?.id || 0;

        try {
            if (subject1 !== 0 || subject2 !== 0 || subject3 !== 0) {
                const response = await suggestApi.getSuggestCourseByCombination(subject1, subject2, subject3);
                setCourseCombination(response);
            } else {
                setCourseCombination([]);
            }
        } catch (error) {
            // Handle API error
            console.error(error);
        }
    };
    useEffect(() => {
        if (showEntranceExam && filteredSubjects.length === 3) {
            getEntranceExamByCombination();
            getSuggestCourseCombination();
        }
    }, [showEntranceExam, filteredSubjects]);
    const skeletonArray = createSkeletonArray(16);

    if (!user) {
        router.push('/auth');
    }
    if (!subjectsData) return <Loader />;

    return (
        <div>
            <ul className="flex gap-4 mt-8 flex-wrap justify-center">
                {!isLoading ? (
                    <>
                        {showCombination
                            ? targetData?.map((combination: any) => (
                                  <Tooltip key={combination.id} color="primary" content={combination?.name}>
                                      <li>
                                          <Card
                                              isPressable
                                              id={combination.name}
                                              className={`w-[80px] sm:w-[120px] rounded-xl border-2 px-2 py-2 sm:py-4 sm:px-4 items-center flex flex-col gap-3 hover:border-blue-500 transition cursor-pointer
                                   ${
                                       selectedCombination === combination.name
                                           ? 'border-blue-500 bg-blue-100 text-blue-500'
                                           : ''
                                   }`}
                                              onClick={() => handleCombinationClick(combination.name)}
                                          >
                                              <div className="sm:font-semibold text-sm sm:text-md">
                                                  {combination.name}
                                              </div>
                                          </Card>
                                      </li>
                                  </Tooltip>
                              ))
                            : null}
                    </>
                ) : (
                    <>
                        {skeletonArray.map((i: number) => (
                            <Skeleton key={i} isLoaded={false} className="rounded-xl">
                                <li className="w-[80px] sm:w-[120px] h-[52px] rounded-xl px-2 py-2 sm:py-4 sm:px-4"></li>
                            </Skeleton>
                        ))}
                    </>
                )}
            </ul>
            {showCombination ? (
                <div className="flex justify-center items-center w-full mt-4">
                    <Button
                        onClick={handleSelectButtonClick}
                        variant="bordered"
                        color="primary"
                        className="w-1/2 mx-7"
                        disabled={!selectedCombination}
                    >
                        Chọn tổ hợp
                    </Button>
                </div>
            ) : null}
            {isCreatingTarget && (
                <Card className="text-sm p-5 sm:p-8 mt-8">
                    <div className="text-center mt-4">
                        <p className="m-4">Bạn chưa có xây dựng mục tiêu tổ hợp môn </p>
                        <Button
                            onClick={() => {
                                // Add logic to navigate to the create target page
                                setShowCombination(true), setIsCreatingTarget(false);
                            }}
                            className="mx-2"
                            variant="bordered"
                            color="default"
                        >
                            Chọn tổ hợp khác
                        </Button>
                        <Button as={Link} href="/edit-profile" variant="bordered" color="primary">
                            Tạo mục tiêu
                        </Button>
                    </div>
                </Card>
            )}{' '}
            <div className="w-[90%] 2xl:w-4/5 mx-auto my-8">
                {showEntranceExam ? (
                    <div>
                        <div className="flex items-center ">
                            <Button
                                onClick={() => {
                                    // Add logic to navigate to the create target page
                                    setShowCombination(true), setShowEntranceExam(false);
                                }}
                                size="lg"
                                className="mx-2"
                                variant="bordered"
                                color="default"
                            >
                                Chọn tổ hợp khác
                            </Button>
                        </div>
                        <h2 className="text-lg my-8">Bài kiểm tra đầu vào:</h2>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-8 gap-2 sm:gap-4">
                            {entranceExamCombination && entranceExamCombination.length > 0 ? (
                                entranceExamCombination.map((examCombination, index) => (
                                    <Card
                                        key={index}
                                        className="relative border-1 border-gray-200 rounded-xl p-2 sm:p-4 shadow-lg"
                                    >
                                        {examCombination?.examId !== null ? (
                                            <div>
                                                <div className="flex font-semibold text-sm sm:text-base truncate2line sm:h-[50px] h-[42px]">
                                                    {examCombination?.attemptStatus == 'DONE' && (
                                                        <MdVerified
                                                            color="rgb(13, 226, 152)"
                                                            className="inline mr-1 mb-1"
                                                            size={20}
                                                        />
                                                    )}
                                                    <span>{examCombination?.examName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                                                    <BsBookFill className="text-blue-700" />
                                                    <span className="text-xs sm:text-sm">
                                                        {getSubjectName(examCombination?.subject)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                                                    <BsClockFill className="text-blue-700" />
                                                    <span className="text-xs sm:text-sm">
                                                        {examCombination?.examDuration} phút
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                                                    <FaUserEdit className="text-blue-700" />
                                                    <span className="text-xs sm:text-sm">
                                                        {examCombination?.examTotalQuestion || 0} câu hỏi
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="flat"
                                                    disabled
                                                    className="w-full mt-2"
                                                    color="primary"
                                                    as={Link}
                                                    isDisabled={examCombination?.grade !== null ? true : false}
                                                    href={`/exam/${examCombination?.examId}/practice`}
                                                >
                                                    {examCombination?.grade !== null
                                                        ? examCombination?.grade?.toFixed(1)
                                                        : 'Làm bài'}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-center mt-4">
                                                <p className="m-4">
                                                    Đề kiểm tra {getSubjectName(examCombination?.subject)} hiện chưa có{' '}
                                                </p>
                                            </div>
                                        )}
                                    </Card>
                                ))
                            ) : (
                                <>Bài Kiểm Tra Đầu Vào Hiện Chưa Có</>
                            )}
                        </ul>
                    </div>
                ) : null}
                {showEntranceExam && alreadyDoEntranceExam ? (
                    <>
                        <h2 className="text-lg mt-16 mb-8">Khóa học gợi ý:</h2>
                        <div className="min-h-[300px] mb-8 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:cols-5">
                            {courseCombination?.length > 0 ? (
                                courseCombination?.map((course, index) => (
                                    <CourseCard
                                        key={index}
                                        course={{
                                            id: course.id,
                                            thumbnail: course.thumbnail,
                                            courseName: course.courseName,
                                            teacherName: course.teacherName,
                                            rating: course.rating,
                                            numberOfRate: course.numberOfRate,
                                            totalVideo: course.totalVideo,
                                            subject: course.subject,
                                            level: course.level,
                                            price: course.price
                                        }}
                                    />
                                ))
                            ) : (
                                <>Hiện tại chưa có khóa học dành cho bạn</>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default ExamDetail;
