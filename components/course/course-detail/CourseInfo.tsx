'use client';
import { User } from '@nextui-org/react';
import { Rate } from 'antd';
import Link from 'next/link';

interface CourseInfoProps {
    courseInfo: {
        courseName: string;
        subject: string;
        level: string;
        teacherName: string;
        numberOfRate: number;
        rating: number;
        totalStudent: number;
        description: string;
        updateDate: string;
    };
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const CourseInfo: React.FC<CourseInfoProps> = ({ courseInfo }) => {
    const dateValue = courseInfo?.updateDate ? new Date(courseInfo?.updateDate) : new Date();
    console.log(courseInfo);

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
            <div className="flex items-baseline my-2">
                <span className="text-base mr-2 font-bold">{courseInfo?.rating?.toFixed(1)}</span>
                <Rate disabled allowHalf defaultValue={courseInfo?.rating} className="!text-xs" />
                <span className="text-xs ml-2">({courseInfo?.numberOfRate})</span>
                <span className="text-sm ml-2">{courseInfo?.totalStudent} học sinh đã tham gia</span>
            </div>
            <div className="my-2 text-sm flex items-center">
                Được tạo bởi:
                <User
                    as={Link}
                    href="/"
                    avatarProps={{ radius: 'full', size: 'sm', src: 'https://i.pravatar.cc/150?img=4' }}
                    className="ml-2 cursor-pointer"
                    name={courseInfo.teacherName}
                />
            </div>
            <p className="my-2 text-sm">Cập nhật gần đây nhất {formattedDate}</p>
            <p className="mt-8 text-sm">{courseInfo?.description}</p>
        </>
    );
};

export default CourseInfo;
