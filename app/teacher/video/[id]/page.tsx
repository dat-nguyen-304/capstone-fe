'use client';

import dynamic from 'next/dynamic';
import { Button } from '@nextui-org/react';
import CommentItem from '@/components/video/CommentItem';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import { BiSolidLike, BiSolidPencil, BiTrash } from 'react-icons/bi';
import { commentsVideoApi, videoApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { ReportModal } from '@/components/modal';
import { useCustomModal } from '@/hooks';
import { useRouter } from 'next/navigation';
import HTMLReactParser from 'html-react-parser';
interface VideoProps {
    params: { id: number };
}

const Video: React.FC<VideoProps> = ({ params }) => {
    const route = useRouter();
    const { data, isLoading } = useQuery<any>({
        queryKey: ['video-teacher-detail', params?.id],
        queryFn: () => videoApi.getVideoDetailByIdForAdminAndTeacher(params?.id)
    });
    const { data: commentsData } = useQuery<any>({
        queryKey: ['teacherCommentsVideo'],
        queryFn: () => commentsVideoApi.getCommentsVideoById(params?.id, 0, 100, 'createdDate', 'DESC')
    });
    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    const mapCommentToCommonInfo = (commentData: any) => {
        return {
            id: commentData.id,
            ownerFullName: commentData.useName || 'Nguyễn Văn A',
            content: commentData.comment || 'Nội dung rất hay'
        };
    };
    const commonInfo = {
        id: 1,
        ownerFullName: 'Nguyễn Văn A',
        content: 'Nội dung rất hay',
        owner: true
    };

    const handleDeleteVideo = async (videoId: number) => {
        try {
            const res = await videoApi.deleteVideo(videoId);
            if (!res.data.code) {
                onSuccess({
                    title: 'Xóa video',
                    content: 'Video đã được xóa thành công'
                });
                route.push('/teacher/video/my-video');
            }
        } catch (error) {
            // Handle error
            onDanger({
                title: 'Có lỗi xảy ra',
                content: 'Hệ thống gặp trục trặc, thử lại sau ít phút'
            });
            console.error('Error changing user status', error);
        }
    };
    const onApproveDeleteOpen = (videoId: number) => {
        onWarning({
            title: 'Xác nhận xóa',
            content: 'Video sẽ bị xóa sau khi bạn duyệt, hành động không dược hoàn tác. Bạn chắc chứ?',
            activeFn: () => handleDeleteVideo(videoId)
        });
        onOpen();
    };
    const onSubmitReport = async () => {};
    if (!data) return <Loader />;
    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button size="sm" onClick={() => route?.back()}>
                        <BsArrowLeft />
                    </Button>
                    <p className="text-blue-700 text-xs sm:text-base font-semibold">{data?.name}</p>
                </div>
                <div className="flex justify-center items-center text-black">
                    <div className="hidden lg:block">
                        <span className="before:inline-block before:text-black before:mx-2">
                            <span className="inline-flex items-center text-sm">
                                <span className="text-black">{data?.like}</span>
                                <BiSolidLike className="text-sm text-blue-500 ml-2" />
                            </span>
                        </span>
                        <Button
                            as={Link}
                            href={`/teacher/video/edit/${params?.id}`}
                            size="sm"
                            color="warning"
                            className="ml-4 text-black hover:text-black"
                        >
                            Chỉnh sửa <BiSolidPencil />
                        </Button>
                        <Button
                            size="sm"
                            color="danger"
                            className="ml-4 text-black hover:text-black"
                            onClick={() => onApproveDeleteOpen(params?.id)}
                        >
                            Xóa video <BiTrash />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mx-auto">
                <div className="relative mt-4 mb-16">
                    <div className="">
                        <div className="object-contain">
                            <ReactPlayer
                                width="100%"
                                height="450px"
                                className="object-contain"
                                controls={true}
                                url={
                                    data?.url ||
                                    'https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5'
                                }
                            />
                        </div>
                        <div className="block lg:hidden mt-4">
                            <span className="inline-flex items-center text-sm">2 tháng trước</span>
                            <span className="before:content-['•'] before:inline-block before:text-black before:mx-2">
                                <span className="inline-flex items-center text-sm">
                                    <span className="text-black">{data?.like}</span>
                                    <BiSolidLike className="text-sm text-blue-500 ml-2" />
                                </span>
                            </span>
                            <Button
                                as={Link}
                                href={`/teacher/video/edit/${params?.id}`}
                                size="sm"
                                color="warning"
                                className="ml-4 hover:text-black"
                            >
                                Chỉnh sửa <BiSolidPencil />
                            </Button>
                        </div>
                        <div className="mt-8 px-0 sm:px-4">
                            <h3 className="mt-8 mb-4 font-semibold text-lg text-slate-800">Mô tả video</h3>
                            <span>{HTMLReactParser(data?.description)}</span>
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
                        </div>
                        <div className="mt-8 px-0 sm:px-4">
                            <h3 className="font-semibold text-lg">Bình luận</h3>
                            <ul className="mt-6 px-0 sm:px-4">
                                {/* <CommentItem />
                                <CommentItem />
                                <CommentItem /> */}
                                {commentsData?.data?.length ? (
                                    commentsData?.data?.map((commentInfo: any, index: number) => (
                                        <CommentItem key={index} commentInfo={mapCommentToCommonInfo(commentInfo)} />
                                    ))
                                ) : (
                                    <>
                                        {/* <CommentItem commentInfo={commonInfo} /> */}
                                        Chưa có bình luận
                                    </>
                                )}
                            </ul>
                            {/* <Button className="w-full">Xem thêm</Button> */}
                        </div>
                    </div>
                </div>
            </div>
            <ReportModal onReport={onSubmitReport} />
        </>
    );
};

export default Video;
