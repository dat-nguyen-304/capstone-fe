'use client';

import { Button, Card, Chip } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { BiSolidLike } from 'react-icons/bi';
import { FaComments } from 'react-icons/fa';
import { RxVideo } from 'react-icons/rx';

interface VideoItemProps {
    type?: 'my-video' | 'teacher-video' | 'teacher-video-draft' | 'admin-review-video' | 'admin-view-video';
    videoItem: any;
    index: number;
    onPreviewOpen: () => void;
    onPreViewUrl: Dispatch<SetStateAction<string>>;
    onVideoName: Dispatch<SetStateAction<string>>;
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

const VideoItem: React.FC<VideoItemProps> = ({ videoItem, index, type, onPreviewOpen, onPreViewUrl, onVideoName }) => {
    const router = useRouter();
    let detailPage = '';
    if (type == 'teacher-video') {
        if (videoItem?.examType) {
            detailPage = `/teacher/quiz/${videoItem?.id}`;
        } else {
            detailPage = `/teacher/video/${videoItem?.id}`;
        }
    } else if (type == 'teacher-video-draft') {
        if (videoItem?.isDraft) {
            detailPage = `/teacher/video/my-video-draft/${videoItem?.id}`;
        } else {
            detailPage = `/teacher/video/${videoItem?.id}`;
        }
    } else if (type == 'my-video') {
        if (videoItem?.examType) {
            detailPage = `/quiz/${videoItem?.id}`;
        } else {
            detailPage = `/video/${videoItem?.id}`;
        }
    } else if (type == 'admin-review-video') {
        if (videoItem?.examType) {
            detailPage = `/teacher/exam/${videoItem?.id}`;
        } else if (videoItem?.isDraft) {
            detailPage = `/admin/video/${videoItem?.id}`;
        } else {
            detailPage = `/admin/approve/video/${videoItem?.id}`;
        }
    } else if (type == 'admin-view-video') {
        if (videoItem?.examType) {
            detailPage = `/admin/exam/${videoItem?.id}`;
        } else {
            detailPage = `/admin/video/${videoItem?.id}`;
        }
    } else {
        detailPage = ``;
    }
    // if (type == 'teacher-video') detailPage = `/teacher/video/${videoItem?.id}`;
    // else if (type == 'teacher-video-draft' && videoItem?.isDraft)
    //     detailPage = `/teacher/video/my-video-draft/${videoItem?.id}`;
    // else if (type == 'teacher-video-draft' && !videoItem?.isDraft) detailPage = `/teacher/video/${videoItem?.id}`;
    // else if (type == 'my-video') detailPage = `/video/${videoItem?.id}`;
    // else if (type == 'admin-review-video' && !videoItem?.isDraft) detailPage = `/admin/video/${videoItem?.id}`;
    // else if (type == 'admin-review-video' && videoItem?.isDraft) detailPage = `/admin/approve/video/${videoItem?.id}`;
    // else if (type == 'admin-view-video') detailPage = `/admin/video/${videoItem?.id}`;
    // else detailPage = `/video/${videoItem?.id}`;

    const goToVideo = () => {
        console.log({ videoItem: videoItem.url });
        if (!type) {
            if (videoItem.videoStatus === 'PRIVATE') return;
            else {
                onPreViewUrl(videoItem.url);
                onVideoName(videoItem.name);
                onPreviewOpen();
            }
        }
        return router.push(detailPage);
    };

    return (
        <li className="relative w-[85%] sm:w-[90%] mx-auto mb-4 py-4 bg-white rounded-xl shadow-lg">
            <div
                onClick={goToVideo}
                className={videoItem.videoStatus === 'PUBLIC' ? 'cursor-pointer' : type ? 'cursor-pointer' : ''}
            >
                <div className="absolute top-1/2 translate-y-[-50%] translate-x-[-50%]">
                    <Image
                        src={
                            videoItem?.examType && videoItem?.attempted
                                ? '/video-number/green.svg'
                                : videoItem?.examType && !videoItem?.attempted
                                ? '/video-number/red.svg'
                                : videoItem?.isWatched
                                ? '/video-number/green.svg'
                                : '/video-number/blue.svg'
                        }
                        width={60}
                        height={60}
                        alt=""
                    />
                    <p className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-white text-sm">
                        {index + 1}
                    </p>
                </div>
                <div className="flex justify-between px-6 sm:px-8">
                    <div className="flex items-center w-4/5">
                        <RxVideo className="text-blue-300 mr-2 text-xl hidden sm:block" />
                        <p className="truncate text-xs sm:text-sm text-black">{videoItem?.name}</p>
                    </div>
                    {!videoItem?.examType ? (
                        <p className="text-xs sm:text-sm text-black">{floatToTime(videoItem?.duration)}</p>
                    ) : null}
                </div>
                <div className="pr-6 pl-8 mt-4 items-center text-xs flex justify-between">
                    {!videoItem?.examType ? (
                        <div>
                            <span className="inline-flex items-center">
                                <span className="text-black">{videoItem?.totalLike}</span>
                                <BiSolidLike className="text-sm text-blue-300 ml-2" />
                            </span>
                            <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                                <span className="inline-flex items-center">
                                    <span className="text-black">{videoItem?.totalComment}</span>
                                    <FaComments className="text-sm text-blue-300 ml-2" />
                                </span>
                            </span>
                        </div>
                    ) : null}
                    {videoItem.videoStatus === 'PUBLIC' && type !== 'my-video' && (
                        <Chip
                            className="capitalize border-none gap-1 text-default-600"
                            color="success"
                            size="sm"
                            variant="dot"
                        >
                            Xem trước
                        </Chip>
                    )}
                    {videoItem.videoStatus === 'PRIVATE' && type && type !== 'my-video' && (
                        <Chip
                            className="capitalize border-none gap-1 text-default-600"
                            color="danger"
                            size="sm"
                            variant="dot"
                        >
                            Không công khai
                        </Chip>
                    )}
                </div>
            </div>
        </li>
    );
};

export default VideoItem;
