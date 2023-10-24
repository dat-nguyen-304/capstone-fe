'use client';

import dynamic from 'next/dynamic';
import VideoHeader from '@/components/header/VideoHeader';
import { Button, Tab, Tabs } from '@nextui-org/react';
import CommentItem from '@/components/video/CommentItem';
import { useState } from 'react';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { OnProgressProps } from 'react-player/base';
import { convertSeconds } from '@/utils';
import Note from '@/components/video/Note';
import { Drawer } from 'antd';
import VideoList from '@/components/video/VideoList';

interface VideoProps {}

const Video: React.FC<VideoProps> = ({}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [openVideoList, setOpenVideoList] = useState(false);
    const showDrawerVideoList = () => {
        setOpenVideoList(true);
    };
    const [currentTime, setCurrentTime] = useState('');
    const handleProgress = (progress: OnProgressProps) => {
        const timeString = convertSeconds(progress.playedSeconds);
        setCurrentTime(timeString);
    };
    return (
        <>
            <VideoHeader />
            <div className="w-[95%] 2xl:w-4/5 mx-auto">
                <div className="relative md:grid grid-cols-10 gap-2 mt-4 mb-16">
                    <div className="col-span-7">
                        <div className="object-contain">
                            <ReactPlayer
                                playing={isPlaying}
                                width="100%"
                                height="450px"
                                className="object-contain"
                                controls={true}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                url="https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5"
                                onProgress={progress => handleProgress(progress)}
                            />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">Làm quen với abcxyz</h3>
                        <Button className="block md:hidden mt-4" size="sm" onClick={showDrawerVideoList}>
                            Danh sách bài học
                        </Button>
                        <div className="mt-8 px-0 sm:px-4">
                            <Tabs aria-label="Options" color="primary" variant="underlined">
                                <Tab key="note" title="Ghi chú">
                                    <Note currentTime={currentTime} />
                                </Tab>
                                <Tab key="comment" title="Bình luận">
                                    <ul className="px-0 sm:px-4">
                                        <CommentItem />
                                        <CommentItem />
                                        <CommentItem />
                                    </ul>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                    <div className="hidden md:block h-full col-span-3">
                        <VideoList />
                    </div>
                    <Drawer
                        title="Nội dung khóa học"
                        placement="right"
                        width={500}
                        open={openVideoList}
                        onClose={() => setOpenVideoList(false)}
                        className="block md:hidden"
                    >
                        <VideoList isOnDrawer={true} />
                    </Drawer>
                </div>
            </div>
        </>
    );
};

export default Video;
