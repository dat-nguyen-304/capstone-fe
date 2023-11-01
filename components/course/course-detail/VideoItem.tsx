'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BiSolidLike } from 'react-icons/bi';
import { FaComments } from 'react-icons/fa';
import { RxVideo } from 'react-icons/rx';

interface VideoItemProps {}

const VideoItem: React.FC<VideoItemProps> = ({}) => {
    return (
        <li className="relative w-[85%] sm:w-[90%] mx-auto mb-4 py-4 bg-white rounded-xl shadow-lg">
            <Link href="/video/1">
                <div className="absolute top-1/2 translate-y-[-50%] translate-x-[-50%]">
                    <Image src="/video-number/blue.svg" width={60} height={60} alt="" />
                    <p className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-white text-sm">
                        1
                    </p>
                </div>
                <div className="flex justify-between px-6 sm:px-8">
                    <div className="flex items-center w-4/5">
                        <RxVideo className="text-blue-300 mr-2 text-xl hidden sm:block" />
                        <p className="truncate text-xs sm:text-sm text-black">Làm quen với abcxyz</p>
                    </div>
                    <p className="text-xs sm:text-sm text-black">12:30</p>
                </div>
                <div className="px-8 mt-4 text-xs">
                    <span className="inline-flex items-center">
                        <span className="text-black">120</span>
                        <BiSolidLike className="text-sm text-blue-300 ml-2" />
                    </span>
                    <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                        <span className="inline-flex items-center">
                            <span className="text-black">120</span>
                            <FaComments className="text-sm text-blue-300 ml-2" />
                        </span>
                    </span>
                </div>
            </Link>
        </li>
    );
};

export default VideoItem;
