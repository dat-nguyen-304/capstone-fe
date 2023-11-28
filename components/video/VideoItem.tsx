'use client';

import { VideoCardType } from '@/types';
import Image from 'next/image';
import { RxVideo } from 'react-icons/rx';
import Link from 'next/link';
interface VideoItemProps {
    videoItem: VideoCardType;
    index: number;
}

const floatToTime = (durationFloat: number): string => {
    if (durationFloat > 10) {
        const hours = Math.floor(durationFloat / 3600);
        const minutes = Math.floor((durationFloat % 3600) / 60);
        const seconds = Math.floor(durationFloat % 60);

        const formattedHours = hours > 0 ? `${hours}:` : '';
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();
        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    } else {
        const totalSeconds = Math.round(durationFloat * 3600);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = hours > 0 ? `${hours}:` : '';
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();
        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    }
};

const VideoItem: React.FC<VideoItemProps> = ({ videoItem, index }) => {
    return (
        <Link href={`/video/${videoItem?.id}`}>
            <li className="relative w-[85%] sm:w-[90%] mx-auto mb-2 py-2 bg-white rounded-xl shadow-lg">
                <div className="absolute top-1/2 translate-y-[-50%] translate-x-[-50%]">
                    <Image src="/video-number/blue.svg" width={40} height={40} alt="" />
                    <p className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-white text-xs">
                        {index + 1}
                    </p>
                </div>
                <div className="px-4 sm:px-6">
                    <div className="flex items-center w-full">
                        <RxVideo size={20} className="text-blue-300 mr-2 text-xl hidden sm:block" />
                        <p className="text-xs">{videoItem?.name}</p>
                    </div>
                </div>
                <div className="px-8 mt-2">
                    <p className="text-xs">{floatToTime(videoItem?.duration)}</p>
                </div>
            </li>
        </Link>
    );
};

export default VideoItem;
