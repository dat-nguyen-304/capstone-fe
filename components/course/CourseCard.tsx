import { CourseCardType } from '@/types';
import { Card, CardBody, CardHeader, Chip, ChipProps } from '@nextui-org/react';
import { Progress, Rate } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const statusColorMap: Record<string, ChipProps['color']> = {
    AVAILABLE: 'success',
    REJECT: 'danger',
    BANNED: 'danger',
    WAITING: 'primary',
    UPDATING: 'primary',
    UNAVAILABLE: 'warning'
};

interface CourseCardProps {
    isMyCourse?: boolean;
    isTeacherCourse?: boolean;
    course: CourseCardType;
}

const CourseCard: React.FC<CourseCardProps> = ({ isMyCourse, isTeacherCourse, course }) => {
    let detailPage = '';
    if (isTeacherCourse) detailPage = `/teacher/course/${course?.id}`;
    else if (isMyCourse) detailPage = `/my-course/${course?.id}`;
    else detailPage = `/course/${course?.id}`;
    return (
        <div className="flex justify-center w-full">
            <Card shadow="sm" isPressable className="w-full max-w-[320px] mt-4 mx-1">
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
                        {isTeacherCourse && (
                            <Chip
                                className="capitalize border-none p-0 mt-3 ml-[-2px] text-default-600 text-xs"
                                color={statusColorMap[course?.status as string]}
                                size="sm"
                                variant="dot"
                            >
                                {course?.status === 'AVAILABLE'
                                    ? 'Hoạt động'
                                    : course?.status === 'WAITING'
                                    ? 'Chờ xác thực'
                                    : course?.status === 'REJECT'
                                    ? 'Đã từ chối'
                                    : course?.status === 'BANNED'
                                    ? 'Đã Xóa'
                                    : course?.status === 'UPDATING'
                                    ? 'Chờ cập nhật'
                                    : 'Vô hiệu'}
                            </Chip>
                        )}
                    </CardBody>
                </Link>
            </Card>
        </div>
    );
};

export default CourseCard;
