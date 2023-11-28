'use client';

import { Button, Card, Link, Pagination, Select, SelectItem, Skeleton, Tooltip, User } from '@nextui-org/react';
import StudentLayout from '@/components/header/StudentLayout';
import { combinationApi, examApi, studentApi, subjectApi } from '@/api-client';
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
import { link } from 'fs';
import { createSkeletonArray } from '@/utils';

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

const ExamDetail: React.FC<ExamDetailProps> = ({ params }) => {
    const { user } = useUser();
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState<number>(1);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [selectedCombination, setSelectedCombination] = useState<string | null>(null);
    const [isCreatingTarget, setIsCreatingTarget] = useState(false);
    const [showCombination, setShowCombination] = useState(true);
    const [showEntranceExam, setShowEntranceExam] = useState(false);

    const { data: subjectsData } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });
    const { data, isLoading } = useQuery({
        queryKey: ['combinationIds'],
        queryFn: combinationApi.getAll,
        staleTime: Infinity
    });
    const { data: targetData } = useQuery({
        queryKey: ['targets'],
        queryFn: studentApi.getTarget
    });
    const { data: entranceExam } = useQuery({
        queryKey: ['entranceExam', { selectedSubject }],
        queryFn: () => examApi.getEntranceExamBySubject(getSubjectNameById(selectedSubject !== 0 ? selectedSubject : 1))
    });
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>(subjectsData || []);
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
                console.log(filteredSubjects);
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
    console.log(filteredSubjects[0]?.id);

    const skeletonArray = createSkeletonArray(16);
    if (!subjectsData) return <Loader />;

    return (
        <StudentLayout>
            <ul className="flex gap-4 mt-8 flex-wrap justify-center">
                {!isLoading ? (
                    <>
                        {showCombination
                            ? data?.map((combination: Combination) => (
                                  <Tooltip key={combination.id} color="primary" content={combination.description}>
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
                <div className="flex justify-center w-full mt-4">
                    <Button
                        onClick={handleSelectButtonClick}
                        variant="bordered"
                        color="primary"
                        className="w-full mx-7"
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
                            <Select
                                size="lg"
                                isRequired
                                isDisabled={false}
                                label="Chọn môn"
                                color="primary"
                                variant="bordered"
                                labelPlacement="outside"
                                defaultSelectedKeys={[filteredSubjects?.length ? `${filteredSubjects[0]?.id}` : '1']}
                                value={selectedSubject}
                                name="subject"
                                className="w-1/5"
                                onChange={event => setSelectedSubject(Number(event.target.value))}
                            >
                                {filteredSubjects?.map((subject: Subject) => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </Select>
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
                            {entranceExam !== '' ? (
                                <Card className="relative border-1 border-gray-200 rounded-xl p-2 sm:p-4 shadow-lg">
                                    <div className="flex font-semibold text-sm sm:text-base truncate">
                                        <span>{entranceExam?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-4 mt-2">
                                        <BsBookFill className="text-blue-700" />
                                        <span className="text-xs sm:text-sm">
                                            {getSubjectName(entranceExam?.subject)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-4 mt-2">
                                        <BsClockFill className="text-blue-700" />
                                        <span className="text-xs sm:text-sm">{entranceExam?.duration} phút</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-4 mt-2">
                                        <FaUserEdit className="text-blue-700" />
                                        <span className="text-xs sm:text-sm">
                                            {entranceExam?.questionList?.length} câu hỏi
                                        </span>
                                    </div>
                                    <Button
                                        variant="flat"
                                        disabled
                                        className="mt-2"
                                        color="primary"
                                        as={Link}
                                        href={`/exam/${entranceExam?.id}/practice`}
                                    >
                                        Làm bài
                                    </Button>
                                </Card>
                            ) : (
                                <>Bài Kiểm Tra Đầu Vào Hiện Chưa Có</>
                            )}
                        </ul>
                    </div>
                ) : null}
                <h2 className="text-lg mt-16 mb-8">Khóa học gợi ý:</h2>
                <div className="min-h-[300px] mb-8 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:cols-5">
                    <CourseCard
                        key="1"
                        course={{
                            id: 1,
                            thumbnail: '/banner/slide-1.png',
                            courseName: 'course mới',
                            teacherName: 'nguyen van a',
                            rating: 4.3,
                            numberOfRate: 4,
                            totalVideo: 12,
                            subject: 'Toán học',
                            level: 'Cơ bản',
                            price: 1000000
                        }}
                    />

                    <CourseCard
                        key="2"
                        course={{
                            id: 1,
                            thumbnail: '/banner/slide-1.png',
                            courseName: 'course mới',
                            teacherName: 'nguyen van a',
                            rating: 4.3,
                            numberOfRate: 4,
                            totalVideo: 12,
                            subject: 'Toán học',
                            level: 'Cơ bản',
                            price: 1000000
                        }}
                    />
                    <CourseCard
                        key="3"
                        course={{
                            id: 1,
                            thumbnail: '/banner/slide-1.png',
                            courseName: 'course mới',
                            teacherName: 'nguyen van a',
                            rating: 4.3,
                            numberOfRate: 4,
                            totalVideo: 12,
                            subject: 'Toán học',
                            level: 'Cơ bản',
                            price: 1000000
                        }}
                    />
                </div>
            </div>
        </StudentLayout>
    );
};

export default ExamDetail;
