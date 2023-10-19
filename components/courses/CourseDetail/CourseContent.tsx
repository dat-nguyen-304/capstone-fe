'use client';

import Image from 'next/image';
import VideoItem from './VideoItem';

interface CourseContentProps {}

const CourseContent: React.FC<CourseContentProps> = ({}) => {
    return (
        <>
            <h3 className="mt-16 mb-8 font-bold text-lg text-slate-800 uppercase">Nội dung khóa học</h3>
            <div className="px-4 sm:px-8 mt-4 text-sm">
                <span className="inline-flex items-center">
                    <span className="font-bold mr-1">20</span>
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
            </div>
            <ul className="max-h-[500px] overflow-y-scroll mt-8">
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
            </ul>
        </>
    );
};

export default CourseContent;
