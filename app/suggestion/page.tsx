'use client';

import { Button, Card, Link, Pagination, Select, SelectItem, User } from '@nextui-org/react';
import StudentLayout from '@/components/header/StudentLayout';
import { examApi, subjectApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Subject } from '@/types';
import TestResultLine from '@/components/test/TestResultLine';
import { BsBookFill, BsClockFill } from 'react-icons/bs';
import { FaUserEdit } from 'react-icons/fa';
import CourseCard from '@/components/course/CourseCard';
import { useUser } from '@/hooks';

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
    const { user } = useUser();
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState<number>(1);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);

    const { data: subjectsData } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });

    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };

    if (!subjectsData) return <Loader />;

    return (
        <StudentLayout>
            <div className="w-[90%] 2xl:w-4/5 mx-auto my-8">
                <Select
                    size="sm"
                    isRequired
                    isDisabled={false}
                    label="Chọn khối"
                    color="primary"
                    variant="bordered"
                    defaultSelectedKeys={['1']}
                    value={selectedSubject}
                    name="subject"
                    className="w-1/5"
                    onChange={event => setSelectedSubject(Number(event.target.value))}
                >
                    {subjectsData.map((subject: Subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                        </SelectItem>
                    ))}
                </Select>
                <h2 className="text-lg my-8">Danh sách bài kiểm tra đầu vào:</h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-8 gap-2 sm:gap-4">
                    <Card className="relative border-1 border-gray-200 rounded-xl p-2 sm:p-4 shadow-lg">
                        <div className="flex font-semibold text-sm sm:text-base truncate">
                            <span>Môn Toán học</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 mt-2">
                            <BsClockFill className="text-blue-700" />
                            <span className="text-xs sm:text-sm">12 phút</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 mt-2">
                            <FaUserEdit className="text-blue-700" />
                            <span className="text-xs sm:text-sm">60 câu hỏi</span>
                        </div>
                        <Button variant="flat" disabled className="mt-2" color="primary">
                            ĐIỂM SỐ: 9
                        </Button>
                    </Card>
                    <Card className="relative border-1 border-gray-200 rounded-xl p-2 sm:p-4 shadow-lg">
                        <div className="flex font-semibold text-sm sm:text-base truncate">
                            <span>Môn Vật lý</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 mt-2">
                            <BsClockFill className="text-blue-700" />
                            <span className="text-xs sm:text-sm">12 phút</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 mt-2">
                            <FaUserEdit className="text-blue-700" />
                            <span className="text-xs sm:text-sm">60 câu hỏi</span>
                        </div>
                        <Button variant="bordered" className="mt-2">
                            Làm bài
                        </Button>
                    </Card>
                    <Card className="relative border-1 border-gray-200 rounded-xl p-2 sm:p-4 shadow-lg">
                        <div className="flex font-semibold text-sm sm:text-base truncate">
                            <span>Môn Hóa học</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 mt-2">
                            <BsClockFill className="text-blue-700" />
                            <span className="text-xs sm:text-sm">12 phút</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 mt-2">
                            <FaUserEdit className="text-blue-700" />
                            <span className="text-xs sm:text-sm">60 câu hỏi</span>
                        </div>
                        <Button variant="bordered" className="mt-2">
                            Làm bài
                        </Button>
                    </Card>
                </ul>
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
                </div>
            </div>
        </StudentLayout>
    );
};

export default ExamDetail;
