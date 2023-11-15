'use client';

import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { SiLevelsdotfyi } from 'react-icons/si';
import { TfiVideoClapper } from 'react-icons/tfi';
import { FaBookReader } from 'react-icons/fa';
import { BsPersonWorkspace } from 'react-icons/bs';

interface BuyCourseProps {
    buyCourse?: {
        id: number;
        thumbnail: string;
        price: number;
        subject: string;
        level: string;
        totalVideo: number;
    };
}

const BuyCourse: React.FC<BuyCourseProps> = ({ buyCourse }) => {
    return (
        <div className="sticky top-[70px] mb-8 md:mb-0">
            <Image
                src={buyCourse?.thumbnail || '/banner/slide-1.png'}
                width={600}
                height={300}
                alt=""
                className="w-full"
            />
            <div className="flex justify-center flex-col items-center">
                <p className="text-center text-2xl text-orange-500 mt-4 font-bold">₫ {buyCourse?.price}</p>
                <Button color="primary" className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base">
                    Mua ngay
                </Button>
                <div className="hidden md:block">
                    <div className="flex items-center my-4">
                        <SiLevelsdotfyi className="mr-8" />
                        <span className="text-sm">
                            {buyCourse?.subject} - {buyCourse?.level}
                        </span>
                    </div>
                    <div className="flex items-center my-4">
                        <TfiVideoClapper className="mr-8" />
                        <span className="text-sm">{buyCourse?.totalVideo} bài giảng </span>
                    </div>
                    <div className="flex items-center my-4">
                        <FaBookReader className="mr-8" />
                        <span className="text-sm">5 bài tập</span>
                    </div>
                    <div className="flex items-center my-4">
                        <BsPersonWorkspace className="mr-8" />
                        <span className="text-sm">Học mọi lúc mọi nơi</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyCourse;
