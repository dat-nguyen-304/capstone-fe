'use client';

import dynamic from 'next/dynamic';
import VideoHeader from '@/components/header/VideoHeader';
import { Button, Tab, Tabs, Textarea } from '@nextui-org/react';
import CommentItem from '@/components/video/CommentItem';
import { useState } from 'react';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { OnProgressProps } from 'react-player/base';
import { convertSeconds } from '@/utils';
import Note from '@/components/video/Note';
import { Drawer } from 'antd';
import VideoList from '@/components/video/VideoList';
import { commentsVideoApi, videoApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { ReportModal } from '@/components/modal';
import { BiSolidLike } from 'react-icons/bi';

interface VideoProps {
    params: { id: number };
}

const Video: React.FC<VideoProps> = ({ params }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [openVideoList, setOpenVideoList] = useState(false);
    const [comment, setComment] = useState<string>('');
    const [currentTime, setCurrentTime] = useState('');
    const [isLike, setIsLike] = useState(false);
    const [updateState, setUpdateState] = useState<Boolean>(false);
    const showDrawerVideoList = () => {
        setOpenVideoList(true);
    };

    const handleProgress = (progress: OnProgressProps) => {
        const timeString = convertSeconds(progress.playedSeconds);
        setCurrentTime(timeString);
    };

    const { data, isLoading } = useQuery<any>({
        queryKey: ['video-detail', params?.id],
        queryFn: () => videoApi.getVideoDetailById(params?.id)
    });
    const { data: commentsData } = useQuery<any>({
        queryKey: ['commentsVideo', updateState],
        queryFn: () => commentsVideoApi.getCommentsVideoById(params?.id, 0, 100)
    });
    console.log(commentsData);

    const handleFeedbackSubmission = async () => {
        try {
            const commentVideo = {
                videoId: Number(params?.id),
                commentContent: comment
            };
            console.log(commentVideo);
            const res = await commentsVideoApi.createCommentVideo(commentVideo);
            console.log(res);
            setComment('');
            setUpdateState(prev => !prev);
            // console.log(ratingCourse);
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };
    const mapCommentToCommonInfo = (commentData: any) => {
        return {
            id: commentData.id,
            ownerFullName: commentData.useName || 'Nguyễn Văn A',
            imageUrl: commentData.imageUrl || '/banner/slide-1.png',
            content: commentData.comment || 'Nội dung rất hay'
        };
    };
    const commonInfo = {
        id: 1,
        ownerFullName: 'Nguyễn Văn A',
        imageUrl: '/banner/slide-1.png',
        content: 'Nội dung rất hay'
    };
    if (!data) return <Loader />;

    return (
        <VideoHeader>
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
                                url={
                                    data?.url ||
                                    'https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5'
                                }
                                onProgress={progress => handleProgress(progress)}
                            />
                        </div>
                        <div className="mt-4 flex items-center">
                            <h3 className="text-xl flex-[1] font-semibold">{data?.name}</h3>
                            <div className="flex items-center gap-2">
                                <BiSolidLike
                                    onClick={() => setIsLike(!isLike)}
                                    className={`text-xl ${isLike ? 'text-blue-500' : 'text-gray-500'} `}
                                />
                                <span>12</span>
                            </div>
                        </div>
                        <Button className="block md:hidden mt-4" size="sm" onClick={showDrawerVideoList}>
                            Danh sách bài học
                        </Button>
                        <div className="mt-8 px-0 sm:px-4">
                            <Tabs aria-label="Options" color="primary" variant="underlined">
                                <Tab key="note" title="Ghi chú">
                                    <Note currentTime={currentTime} />
                                </Tab>
                                <Tab key="comment" title="Bình luận">
                                    <Textarea
                                        variant="underlined"
                                        labelPlacement="outside"
                                        placeholder="Viết bình luận"
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            disabled={!comment}
                                            color={comment === '' ? 'default' : 'primary'}
                                            className="my-4"
                                            onClick={handleFeedbackSubmission}
                                        >
                                            Bình luận
                                        </Button>
                                    </div>
                                    <ul className="px-0 sm:px-4">
                                        {commentsData?.data?.length ? (
                                            commentsData?.data?.map((commentInfo: any, index: number) => (
                                                <CommentItem
                                                    key={index}
                                                    commentInfo={mapCommentToCommonInfo(commentInfo)}
                                                />
                                            ))
                                        ) : (
                                            <>
                                                <CommentItem commentInfo={commonInfo} />
                                            </>
                                        )}

                                        {/* <CommentItem />
                                        <CommentItem /> */}
                                    </ul>
                                    {/* <Button className="w-full">Xem thêm</Button> */}
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                    <div className="hidden md:block h-full col-span-3">
                        <VideoList video={data?.videoItemResponses} />
                    </div>
                    <Drawer
                        title="Nội dung khóa học"
                        placement="right"
                        width={500}
                        open={openVideoList}
                        onClose={() => setOpenVideoList(false)}
                        className="block md:hidden"
                    >
                        <VideoList isOnDrawer={true} video={data?.videoItemResponses} />
                    </Drawer>
                </div>
                <ReportModal />
            </div>
        </VideoHeader>
    );
};

export default Video;
