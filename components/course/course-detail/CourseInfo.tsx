'use client';
import { Chip, User } from '@nextui-org/react';
import { Rate } from 'antd';
import HTMLReactParser from 'html-react-parser';
import Link from 'next/link';

interface CourseInfoProps {
    courseInfo: any;
    type?: 'draft';
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const CourseInfo: React.FC<CourseInfoProps> = ({ courseInfo, type }) => {
    const dateValue = courseInfo?.updateDate ? new Date(courseInfo?.updateDate) : new Date();

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })?.format(dateValue);

    return (
        <>
            <h3 className="text-2xl font-semibold truncate">{courseInfo?.courseName}</h3>
            <h3 className="text-l my-4 font-semibold truncate">
                {courseInfo?.subject} - {courseInfo?.level}
            </h3>
            {type != 'draft' ? (
                <div className="flex items-baseline my-2">
                    <span className="text-base mr-2 font-bold">{courseInfo?.rating?.toFixed(1)}</span>
                    <Rate disabled allowHalf value={courseInfo?.rating} className="!text-xs" />
                    <span className="text-xs ml-2">({courseInfo?.numberOfRate})</span>
                    <span className="text-sm ml-2">
                        {courseInfo?.totalStudent > 0
                            ? `${courseInfo?.totalStudent} học sinh đã tham gia`
                            : 'Chưa có học sinh tham gia'}{' '}
                    </span>
                </div>
            ) : null}
            <div className="my-2 text-sm flex items-center">
                Được tạo bởi:
                <User
                    as={Link}
                    href={`/profile/teacher/${courseInfo?.teacherEmail}`}
                    avatarProps={{ radius: 'full', size: 'sm', src: courseInfo.teacherAvatar || '/teacher.png' }}
                    className="ml-2 cursor-pointer text-blue-500"
                    name={courseInfo?.teacherName}
                />
            </div>
            <p className="my-2 text-sm">Cập nhật gần đây nhất {formattedDate}</p>
            {courseInfo?.topics && courseInfo?.topics?.length > 0
                ? courseInfo?.topics?.map((sub: any) => (
                      <Chip size="sm" color="primary" className="mr-2 mt-2" variant="flat" key={sub}>
                          {sub}
                      </Chip>
                  ))
                : null}
            <div className="mt-8 text-sm">{HTMLReactParser(courseInfo?.description)}</div>
        </>
    );
};

export default CourseInfo;
