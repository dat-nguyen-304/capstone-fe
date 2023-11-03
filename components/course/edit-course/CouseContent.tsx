'use client';

import Image from 'next/image';
import VideoSortItem from './VideoSortItem';
import { Button } from '@nextui-org/react';

interface CourseContentProps {}

const CourseContent: React.FC<CourseContentProps> = ({}) => {
    return (
        <div className="xl:grid grid-cols-10 mt-6">
            <div className="hidden xl:block col-span-3 p-4 bg-blue-200 rounded-xl sticky top-[70px] h-[380px]">
                <Image src="/banner/slide-1.png" alt="" width={300} height={240} />
                <h2 className="truncate2line font-bold text-lg mt-4">Khóa học abcxyz</h2>
                <h3 className="mt-1 font-semibold">Nguyễn Văn An</h3>
                <div className="mt-4">
                    <span className="inline-flex items-center">
                        <span className="text-sm font-bold mr-1">20</span>
                        <span className="text-sm mr-1">Bài giảng</span>
                        <Image src="/video-number/blue.svg" width={25} height={25} alt="" />
                    </span>
                    <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                        <span className="inline-flex items-center">
                            <span className="text-sm font-bold mr-1">5</span>
                            <span className="text-sm mr-1">Bài tập</span>
                            <Image src="/video-number/red.svg" width={25} height={25} alt="" />
                        </span>
                    </span>
                </div>
                <div className="mt-1 text-xs">Cập nhật 6 giờ trước</div>
                <div className="mt-4">
                    <Button color="primary" size="sm">
                        Thêm video
                    </Button>
                </div>
            </div>
            <div className="col-span-7 mx-0 xl:mx-[40px]">
                <ul>
                    <VideoSortItem />
                    <VideoSortItem />
                    <VideoSortItem />
                    <VideoSortItem />
                    <VideoSortItem />
                    <VideoSortItem />
                    <VideoSortItem />
                    <VideoSortItem />
                    <VideoSortItem />
                    <VideoSortItem />
                    <VideoSortItem />
                    <VideoSortItem />
                </ul>
            </div>
        </div>
    );
};

export default CourseContent;
