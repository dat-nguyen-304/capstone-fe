'use client';

import Image from 'next/image';
import { BiSolidLike } from 'react-icons/bi';
import { FaComments } from 'react-icons/fa';
import { RxVideo } from 'react-icons/rx';

interface VideoItemProps {}

const VideoItem: React.FC<VideoItemProps> = ({}) => {
    return (
        <li className="relative w-[90%] mx-auto my-4 py-4 bg-white rounded-xl shadow-lg">
            <div className="absolute top-1/2 translate-y-[-50%] translate-x-[-50%]">
                <Image src="/video-number/blue.svg" width={60} height={60} alt="" />
                <p className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-white text-sm">1</p>
            </div>
            <div className="flex justify-between px-8">
                <div className="flex items-center">
                    <RxVideo className="text-blue-300 mr-2 text-xl" />
                    <span>Làm quen với abcxyz</span>
                </div>
                <span className="text-sm">12:30</span>
            </div>
            <div className="px-8 mt-4 text-xs">
                <span className="inline-flex items-center">
                    <span>120</span>
                    <BiSolidLike className="text-sm text-blue-300 ml-2" />
                </span>
                <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                    <span className="inline-flex items-center">
                        <span>120</span>
                        <FaComments className="text-sm text-blue-300 ml-2" />
                    </span>
                </span>
            </div>
        </li>
    );
};

export default VideoItem;
