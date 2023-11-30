'use client';

import Image from 'next/image';
import { SiLevelsdotfyi, SiProgress } from 'react-icons/si';
import { TfiVideoClapper } from 'react-icons/tfi';
import { FaBookReader, FaCheckDouble } from 'react-icons/fa';
import { Progress } from 'antd';

interface CourseImageProps {
    courseImage: any;
}

const CourseImage: React.FC<CourseImageProps> = ({ courseImage }) => {
    return (
        <div className="sticky top-[70px] mb-8 md:mb-0">
            <Image
                src={courseImage.thumbnail || '/banner/slide-1.png'}
                width={600}
                height={300}
                alt=""
                className="w-full rounded-xl h-[200px] object-cover object-center"
            />
            <div className="hidden md:flex justify-center flex-col items-center">
                <div>
                    <div className="flex items-center my-4">
                        <SiLevelsdotfyi className="mr-8" />
                        <span className="text-sm">
                            {courseImage?.subject} - {courseImage?.level}
                        </span>
                    </div>
                    <div className="flex items-center my-4">
                        <TfiVideoClapper className="mr-8" />
                        <span className="text-sm">{courseImage.totalVideo} bài giảng </span>
                    </div>
                    <div className="flex items-center my-4">
                        <FaBookReader className="mr-8" />
                        <span className="text-sm">{courseImage?.totalQuiz || 0} bài tập</span>
                    </div>
                    <div className="flex items-center my-4">
                        <FaCheckDouble className="mr-8" />
                        <span className="text-sm">Đã hoàn thành: 0/{courseImage.totalVideo}</span>
                    </div>
                    <div className="flex items-center my-4">
                        <SiProgress className="mr-8" />
                        <div className="flex-[1]">
                            <Progress percent={0} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-4 md:hidden">
                <Progress className="m-0 max-w-[300px]" percent={0} />
            </div>
        </div>
    );
};

export default CourseImage;
