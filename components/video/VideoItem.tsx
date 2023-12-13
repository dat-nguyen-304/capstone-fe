'use client';

import { VideoCardType } from '@/types';
import Image from 'next/image';
import { RxQuestionMark, RxQuestionMarkCircled, RxVideo } from 'react-icons/rx';
import Link from 'next/link';
import { MdVerified } from 'react-icons/md';
interface VideoItemProps {
    videoItem: any;
    index: number;
    courseId?: any;
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

const VideoItem: React.FC<VideoItemProps> = ({ videoItem, index, courseId }) => {
    return (
        <Link
            href={
                courseId
                    ? videoItem?.examType
                        ? `/quiz/${courseId}/${videoItem?.id}`
                        : `/video/${courseId}/${videoItem?.id}`
                    : `/video/${videoItem?.id}`
            }
        >
            <li className="relative w-[85%] sm:w-[90%] mx-auto mb-2 py-2 bg-white rounded-xl shadow-lg">
                <div className="absolute top-1/2 translate-y-[-50%] translate-x-[-50%]">
                    <Image
                        src={
                            videoItem?.examType
                                ? '/video-number/red.svg'
                                : videoItem?.isWatched
                                ? '/video-number/green.svg'
                                : '/video-number/blue.svg'
                        }
                        width={40}
                        height={40}
                        alt=""
                    />
                    <p className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-white text-xs">
                        {index + 1}
                    </p>
                </div>
                <div className="px-4 sm:px-6">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center w-4/5">
                            {videoItem?.examType ? (
                                <RxQuestionMarkCircled className="text-blue-300 mr-2 text-xl hidden sm:block" />
                            ) : (
                                <RxVideo className="text-blue-300 mr-2 text-xl hidden sm:block" />
                            )}
                            <p className="text-xs truncate">{videoItem?.name} </p>
                        </div>
                        <p>
                            {videoItem?.attempted ? (
                                <MdVerified color="rgb(13, 226, 152)" className="inline mr-1 mb-1" size={24} />
                            ) : null}
                        </p>
                    </div>
                </div>
                <div className="px-8 mt-2">
                    {!videoItem?.examType ? <p className="text-xs">{floatToTime(videoItem?.duration)}</p> : null}
                </div>
            </li>
        </Link>
    );
};

export default VideoItem;
