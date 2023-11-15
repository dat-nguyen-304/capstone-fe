'use client';

import Image from 'next/image';
import VideoItem from './VideoItem';

interface CourseContentProps {
    isMyCourse?: boolean;
    isTeacherCourse?: boolean;
    courseContent?: {
        id: number;
        totalVideo: number;
        listVideo: Array<{
            id: number;
            name: string;
            duration: number;
            totalComment: number;
            totalLike: number;
        }>;
    };
}

const CourseContent: React.FC<CourseContentProps> = ({ isMyCourse, isTeacherCourse, courseContent }) => {
    return (
        <>
            <h3 className="mt-16 mb-8 font-bold text-lg text-slate-800 uppercase">Nội dung khóa học</h3>
            <div className="px-4 sm:px-8 mt-4 text-sm">
                <span className="inline-flex items-center">
                    <span className="font-bold mr-1">{courseContent?.totalVideo}</span>
                    <span>Bài giảng</span>
                    <Image src="/video-number/blue.svg" width={30} height={30} alt="" />
                </span>
                <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                    <span className="inline-flex items-center">
                        <span className="font-bold mr-1">5</span>
                        <span>Bài tập</span>
                        <Image src="/video-number/red.svg" width={30} height={30} alt="" />
                    </span>
                </span>
                {isMyCourse && (
                    <span className="sm:before:content-['•'] sm:before:inline-block sm:before:text-gray-500 sm:before:mx-2">
                        <span className="mt-2 sm:mt-0 inline-flex items-center">
                            <span>Hoàn thành</span>
                            <span className="font-bold mx-1">5</span>
                            <span>/30</span>
                            <Image src="/video-number/green.svg" width={30} height={30} alt="" />
                        </span>
                    </span>
                )}
            </div>
            <ul className="max-h-[500px] overflow-y-scroll mt-8">
                {courseContent?.listVideo?.map((videoItem, index) => (
                    <VideoItem key={index} videoItem={videoItem} index={index} />
                ))}
            </ul>
        </>
    );
};

export default CourseContent;
