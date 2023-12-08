'use client';

import dynamic from 'next/dynamic';
import VideoHeader from '@/components/header/VideoHeader';
import { Button, Tab, Tabs, Textarea } from '@nextui-org/react';
import CommentItem from '@/components/video/CommentItem';
import { useEffect, useState } from 'react';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { OnProgressProps } from 'react-player/base';
import { convertSeconds } from '@/utils';
import Note from '@/components/video/Note';
import { Drawer } from 'antd';
import VideoList from '@/components/video/VideoList';
import { commentsVideoApi, courseApi, examApi, progressVideoApi, reactVideoApi, videoApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { ReportModal } from '@/components/modal';
import { BiSolidLike } from 'react-icons/bi';
import HTMLReactParser from 'html-react-parser';
import Link from 'next/link';
import Home from '@/app/page';

interface VideoProps {
    params: { id: number[] };
}

const Video: React.FC<VideoProps> = ({ params }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [openVideoList, setOpenVideoList] = useState(false);
    const [comment, setComment] = useState<string>('');
    const [currentTime, setCurrentTime] = useState('');
    const [isLike, setIsLike] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [numberLike, setNumberLike] = useState<number>(0);
    const [updateState, setUpdateState] = useState<Boolean>(false);
    const [reportCommentId, setReportCommentId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [hasCalledProgressApi, setHasCalledProgressApi] = useState(false);
    const [listVideo, setListVideo] = useState<any[]>([]);
    const showDrawerVideoList = () => {
        setOpenVideoList(true);
    };

    const {
        data,
        isLoading,
        refetch: videoRefetch
    } = useQuery<any>({
        queryKey: ['video-detail', { params: params?.id[1] }],
        queryFn: () => videoApi.getVideoDetailById(params?.id[1])
    });
    const { data: commentsData, refetch } = useQuery<any>({
        queryKey: ['commentsVideo', updateState],
        queryFn: () => commentsVideoApi.getCommentsVideoById(params?.id[1], 0, 100, 'createdDate', 'DESC')
    });
    const { data: quizzesData } = useQuery<any>({
        queryKey: ['video-quiz-by-course', { params: params?.id[0] }],
        queryFn: () => examApi.getQuizCourseById(params?.id[0])
    });

    const { data: courseData, refetch: courseRefetch } = useQuery<any>({
        queryKey: ['my-course-video-detail', { params: params?.id[0] }],
        queryFn: () => courseApi.getCourseById(params?.id[0])
    });

    useEffect(() => {
        if (quizzesData?.data || data?.videoItemResponses) {
            const mergedList = [...(data?.videoItemResponses || []), ...(quizzesData?.data || [])].sort((a, b) => {
                const aOrder = a.ordinalNumber || a.courseOrder || 0;
                const bOrder = b.ordinalNumber || b.courseOrder || 0;
                return aOrder - bOrder;
            });
            setListVideo(mergedList);
        }
    }, [quizzesData, data]);

    const handleProgress = (progress: OnProgressProps) => {
        const timeString = convertSeconds(progress.playedSeconds);
        const videoDuration = data?.duration || 0;
        const threshold = 5;
        setCurrentTime(timeString);

        if (videoDuration - progress.playedSeconds <= threshold && !isWatched && !hasCalledProgressApi) {
            callProgressApi(params?.id[1]);
            setHasCalledProgressApi(true); // Set the state to indicate that the API has been called
        } else {
        }
    };

    const callProgressApi = async (videoId: number) => {
        try {
            // Call your API here
            const res = await progressVideoApi.progressApi(videoId);
            if (res) {
                videoRefetch();
                courseRefetch();
            }
        } catch (error) {
            console.error('Error calling progress API:', error);
        }
    };

    useEffect(() => {
        if (data) {
            setIsLike(data?.reactStatus ? true : false);
            setNumberLike(data?.like);
            setIsWatched(data?.isWatched);
        }
    }, [data]);

    const handleFeedbackSubmission = async () => {
        try {
            setIsSubmitting(true);
            const commentVideo = {
                videoId: Number(params?.id[1]),
                commentContent: comment
            };

            const res = await commentsVideoApi.createCommentVideo(commentVideo);

            if (res) {
                setIsSubmitting(false);
                setComment('');
                refetch();
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error('Error submitting feedback:', error);
        }
    };
    const onSubmitLike = async () => {
        try {
            const reactVideo = {
                videoId: Number(params?.id[1]),
                status: isLike ? 'DISLIKE' : 'LIKE'
            };

            const res = await reactVideoApi.reactVideo(reactVideo);
            if (res) {
                setIsLike(!isLike);
                if (!isLike) {
                    setNumberLike(prev => prev + 1);
                } else {
                    setNumberLike(prev => prev - 1);
                }
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };
    const mapCommentToCommonInfo = (commentData: any) => {
        return {
            id: commentData.id,
            ownerFullName: commentData.useName || 'Nguyễn Văn A',
            content: commentData.comment || 'Nội dung rất hay',
            ownerAvatar: commentData?.avatar || 'https://i.pravatar.cc/150?u=a04258114e29026708c'
        };
    };

    if (params?.id?.length <= 1) return <Home />;
    if (!data) return <Loader />;

    return (
        <VideoHeader type="video" id={params?.id[1]} course={courseData}>
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
                                    onClick={() => onSubmitLike()}
                                    className={`text-xl cursor-pointer ${isLike ? 'text-blue-500' : 'text-gray-500'} `}
                                />
                                <span>{numberLike}</span>
                            </div>
                        </div>
                        <Button className="block md:hidden mt-4" size="sm" onClick={showDrawerVideoList}>
                            Danh sách bài học
                        </Button>
                        <h3 className="mt-8 mb-4 font-semibold text-lg text-slate-800">Mô tả video</h3>
                        <p>{HTMLReactParser(data?.description)}</p>
                        {data?.material ? (
                            <p className="mt-16 mb-8 font-semibold text-lg text-slate-800">
                                Tài liệu đính kèm:
                                <span className="ml-2 text-medium text-blue-400 underline">
                                    <Link href={data?.material} target="_blank">
                                        Tài liệu
                                    </Link>
                                </span>
                            </p>
                        ) : null}
                        <div className="mt-8 px-0">
                            <Tabs aria-label="Options" color="primary" variant="underlined">
                                <Tab key="note" title="Ghi chú">
                                    <Note currentTime={currentTime} videoId={params?.id[1]} />
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
                                            isLoading={isSubmitting}
                                        >
                                            Bình luận
                                        </Button>
                                    </div>
                                    <ul className="px-0 sm:px-4">
                                        {commentsData?.data?.length ? (
                                            commentsData?.data?.map((commentInfo: any, index: number) => (
                                                <CommentItem
                                                    key={index}
                                                    refetch={refetch}
                                                    commentInfo={mapCommentToCommonInfo(commentInfo)}
                                                    onCommentId={setReportCommentId}
                                                />
                                            ))
                                        ) : (
                                            <div>Chưa có phản hồi</div>
                                        )}
                                    </ul>
                                    {/* <Button className="w-full">Xem thêm</Button> */}
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                    <div className="hidden md:block h-full col-span-3">
                        <VideoList video={listVideo} courseId={params?.id[0]} />
                    </div>
                    <Drawer
                        title="Nội dung khóa học"
                        placement="right"
                        width={500}
                        open={openVideoList}
                        onClose={() => setOpenVideoList(false)}
                        className="block md:hidden"
                    >
                        <VideoList isOnDrawer={true} video={listVideo} courseId={params?.id[0]} />
                    </Drawer>
                </div>
            </div>
        </VideoHeader>
    );
};

export default Video;
