import { CourseCardType } from '@/types';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Progress, Rate } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
    isMyCourse?: boolean;
    isTeacherCourse?: boolean;
    course: CourseCardType;
}

const CourseCard: React.FC<CourseCardProps> = ({ isMyCourse, isTeacherCourse, course }) => {
    let detailPage = '';
    if (isTeacherCourse) detailPage = '/teacher/course/1';
    else if (isMyCourse) detailPage = '/my-course/1';
    else detailPage = `/course/${course?.id}`;
    return (
        <div className="flex justify-center w-full">
            <Card shadow="sm" isPressable className="w-full max-w-[400px] mt-4 mx-1 overflow-auto">
                <Link href={detailPage}>
                    <CardHeader className="overflow-visible p-0">
                        <Image height={216} width={384} alt="" className="rounded-xl" src={course?.thumbnial} />
                    </CardHeader>
                    <CardBody className="text-small justify-between">
                        <b className="text-[15px] h-[40px] font-semibold truncate2line text-black">
                            {course.courseName}
                        </b>
                        <p className="mt-2 text-sm text-black">{course.teacherName}</p>
                        <div className="flex items-baseline mt-1">
                            <span className="text-base mr-2 font-bold text-black">{course.rating}</span>
                            <Rate disabled allowHalf defaultValue={course.rating} className="!text-xs" />
                            <span className="text-xs ml-2 text-black">({course.numberOfRate})</span>
                        </div>
                        <div className="mt-1 text-xs">
                            <span className="text-black">{course.totalVideo} bài giảng</span>
                            <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2 text-black">
                                {course.subject}
                            </span>
                            <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2 text-black">
                                {course.level}
                            </span>
                        </div>
                        {isMyCourse ? (
                            <div className="w-full mt-2">
                                <Progress className="w-full" percent={30} />
                            </div>
                        ) : (
                            <p className="mt-1 text-[#333] font-bold text-base">
                                ₫ {course.price.toLocaleString('vi-VN')}
                            </p>
                        )}
                    </CardBody>
                </Link>
            </Card>
        </div>
    );
};

export default CourseCard;
