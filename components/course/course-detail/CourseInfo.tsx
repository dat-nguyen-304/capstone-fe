'use client';
import { Rate } from 'antd';

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
                <span className="text-base mr-2 font-bold">{courseInfo?.rating}</span>
                <Rate disabled allowHalf defaultValue={courseInfo?.rating} className="!text-xs" />
                <span className="text-xs ml-2">{courseInfo?.numberOfRate}</span>
                <span className="text-sm ml-2">{courseInfo?.totalStudent}</span>
            </div>
            <p className="my-2 text-sm">Được tạo bởi {courseInfo?.teacherName}</p>
            <p className="my-2 text-sm">Cập nhật gần đây nhất {formattedDate}</p>
            <p className="mt-8 text-sm">{courseInfo?.description}</p>
        </>
    );
};

export default CourseInfo;
