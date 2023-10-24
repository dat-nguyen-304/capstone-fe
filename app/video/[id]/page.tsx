'use client';

import dynamic from 'next/dynamic';
import VideoItem from '@/components/videoPlayer/VideoItem';
import VideoHeader from '@/components/header/VideoHeader';
import { Tab, Tabs } from '@nextui-org/react';
import CommentItem from '@/components/videoPlayer/CommentItem';
import { useState } from 'react';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { OnProgressProps } from 'react-player/base';
import { convertSeconds } from '@/utils';
import Note from '@/components/videoPlayer/Note';

interface VideoProps {}

const Video: React.FC<VideoProps> = ({}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const handleProgress = (progress: OnProgressProps) => {
        const timeString = convertSeconds(progress.playedSeconds);
        setCurrentTime(timeString);
    };
    return (
        <>
            <VideoHeader />
            <div className="w-[90%] lg:w-4/5 mx-auto">
                <div className="relative grid grid-cols-10 gap-2 mt-4 mb-16">
                    <div className="col-span-10 md:col-span-7">
                        <div>
                            <ReactPlayer
                                playing={isPlaying}
                                width="100%"
                                height="450px"
                                controls={true}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                url="https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5"
                                onProgress={progress => handleProgress(progress)}
                            />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">Làm quen với abcxyz</h3>
                        <div className="mt-8 px-4">
                            <Tabs aria-label="Options" color="primary" variant="underlined">
                                <Tab key="note" title="Ghi chú">
                                    <Note currentTime={currentTime} />
                                </Tab>
                                <Tab key="comment" title="Bình luận">
                                    <ul className="px-4">
                                        <CommentItem />
                                        <CommentItem />
                                        <CommentItem />
                                    </ul>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                    <div className="col-span-10 h-full md:col-span-3">
                        <div className="py-4">
                            <ul className="h-[450px] overflow-y-scroll">
                                <VideoItem />
                                <VideoItem />
                                <VideoItem />
                                <VideoItem />
                                <VideoItem />
                                <VideoItem />
                                <VideoItem />
                                <VideoItem />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Video;