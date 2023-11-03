'use client';

import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { AiOutlineMenu } from 'react-icons/ai';

interface VideoSortItemProps {}

const VideoSortItem: React.FC<VideoSortItemProps> = ({}) => {
    return (
        <li className="flex p-1 sm:p-4 rounded-xl border-2 items-center my-1">
            <Image
                src="/video-number/blue.svg"
                width={40}
                height={40}
                alt=""
                className="w-[24px] h-[24px] sm:w-[40px] sm:h-[40px]"
            />
            <div className="h-[50px] w-[100px] ml-0 sm:ml-4 relative">
                <Image src="/banner/slide-1.png" alt="" width={300} height={240} />
                <span className="absolute bottom-0 text-white bg-gray-700 px-1 rounded-md right-0 text-xs">12:30</span>
            </div>
            <div className="max-w-[60%] flex flex-col justify-between ml-1 sm:ml-4">
                <h3 className="font-semibold truncate text-xs sm:text-sm">Giới thiệu abcxyz</h3>
                <div>
                    <span className="text-xs"> 7 ngày trước</span>
                </div>
            </div>
            <div className="ml-auto mr-1">
                <div className="block sm:hidden">
                    <AiOutlineMenu />
                </div>
                <Button size="sm" variant="faded" className="hidden sm:flex">
                    <AiOutlineMenu />
                </Button>
            </div>
        </li>
    );
};

export default VideoSortItem;
