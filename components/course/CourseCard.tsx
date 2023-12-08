import { CourseCardType } from '@/types';
import { Card, CardBody, CardHeader, Chip, ChipProps } from '@nextui-org/react';
import { Progress, Rate } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const statusColorMap: Record<string, ChipProps['color']> = {
    AVAILABLE: 'success',
    REJECT: 'danger',
    BANNED: 'danger',
    DELETED: 'danger',
    WAITING: 'primary',
    DRAFT: 'primary',
    UPDATING: 'primary',
    UNAVAILABLE: 'warning'
};

interface CourseCardProps {
    type?: 'my-course' | 'teacher-course' | 'teacher-course-draft';
    course: CourseCardType;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, type }) => {
    let detailPage = '',
        status = '';
    if (type === 'teacher-course') detailPage = `/teacher/course/${course?.id}`;
    else if (type === 'teacher-course-draft') detailPage = `/teacher/course/my-course-draft/${course?.id}`;
    else if (type === 'my-course') detailPage = `/my-course/${course?.id}`;
    else detailPage = `/course/${course?.id}`;
    if (course.status === 'AVAILABLE') status = 'Hoạt động';
    else if (course.status === 'WAITING') status = 'Chờ xác thực';
    else if (course.status === 'REJECT') status = 'Đã từ chối';
    else if (course.status === 'DELETED') status = 'Đã Xóa';
    else if (course.status === 'UPDATING') status = 'Chờ cập nhật';
    else if (course.status === 'DRAFT') status = 'Bản nháp';
    else status = 'Vô hiệu';

    return (
        <div className="flex justify-center w-full">
            <Card shadow="sm" isPressable className="w-full max-w-[320px] mt-4 mx-1">
                <Link href={detailPage}>
                    <CardHeader className="overflow-visible p-0">
                        <Image
                            height={216}
                            width={384}
                            alt=""
                            className="rounded-xl h-[150px] sm:h-[176px] object-cover object-center"
                            src={course?.thumbnail}
                        />
                    </CardHeader>
                    <CardBody className="text-small justify-between !p-4">
                        <b className="text-[15px] h-[40px] font-semibold truncate2line text-black">
                            {course.courseName}
                        </b>
                        <p className="mt-2 text-sm text-black">{course.teacherName}</p>
                        {type !== 'teacher-course-draft' ? (
                            <div className="flex items-baseline mt-1">
                                <span className="text-base mr-2 font-bold text-black">{course.rating.toFixed(1)}</span>
                                <Rate disabled allowHalf defaultValue={course.rating} className="!text-xs" />
                                <span className="text-xs ml-2 text-black">({course.numberOfRate})</span>
                            </div>
                        ) : null}
                        <div className="mt-1 text-xs">
                            {type !== 'teacher-course-draft' ? (
                                <span className="text-black">{course.totalVideo} bài giảng</span>
                            ) : null}
                            <span
                                className={`${
                                    type !== 'teacher-course-draft'
                                        ? 'before:content-["•"] before:inline-block before:text-gray-500 before:mx-2'
                                        : ''
                                }  text-black`}
                            >
                                {course.subject}
                            </span>
                            <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2 text-black">
                                {course.level}
                            </span>
                        </div>
                        {type === 'my-course' ? (
                            <div className="w-full mt-2">
                                <Progress className="w-full" percent={Number(course?.progress?.toFixed(1))} />
                            </div>
                        ) : (
                            <p className="mt-1 text-[#333] font-bold text-base">
                                ₫ {course.price.toLocaleString('vi-VN')}
                            </p>
                        )}
                        {(type === 'teacher-course' || type === 'teacher-course-draft') && (
                            <Chip
                                className="capitalize border-none p-0 mt-3 ml-[-2px] text-default-600 text-xs"
                                color={statusColorMap[course?.status as string]}
                                size="sm"
                                variant="dot"
                            >
                                {status}
                            </Chip>
                        )}
                    </CardBody>
                </Link>
            </Card>
        </div>
    );
};

export default CourseCard;
