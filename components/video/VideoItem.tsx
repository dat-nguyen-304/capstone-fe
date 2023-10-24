'use client';

import Image from 'next/image';
import { RxVideo } from 'react-icons/rx';

interface VideoItemProps {}

const VideoItem: React.FC<VideoItemProps> = ({}) => {
    return (
        <li className="relative w-[85%] sm:w-[90%] mx-auto mb-2 py-2 bg-white rounded-xl shadow-lg">
            <div className="absolute top-1/2 translate-y-[-50%] translate-x-[-50%]">
                <Image src="/video-number/blue.svg" width={40} height={40} alt="" />
                <p className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-white text-xs">1</p>
            </div>
            <div className="px-4 sm:px-6">
                <div className="flex items-center w-full">
                    <RxVideo size={20} className="text-blue-300 mr-2 text-xl hidden sm:block" />
                    <p className="text-xs">Làm quen với abcxyz</p>
                </div>
            </div>
            <div className="px-8 mt-2">
                <p className="text-xs">12:30</p>
            </div>
        </li>
    );
};

export default VideoItem;
