'use client';

import Image from 'next/image';
import { BiSolidLike } from 'react-icons/bi';
import { FaComments } from 'react-icons/fa';
import { BsBook } from 'react-icons/bs';
import { RxVideo } from 'react-icons/rx';
import VideoItem from './VideoItem';

interface CourseContentProps {}

const CourseContent: React.FC<CourseContentProps> = ({}) => {
    return (
        <>
            <p className="mt-4 font-semibold">Nội dung khóa học</p>
            <div className="px-8 mt-4 text-sm">
                <span className="inline-flex items-center">
                    <span className="font-bold mr-1">20</span>
                    <span>Bài giảng</span>
                </span>
                <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                    <span className="inline-flex items-center">
                        <span className="font-bold mr-1">5</span>
                        <span>Bài tập</span>
                    </span>
                </span>
            </div>
            <ul className="">
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
