'use client';

import dynamic from 'next/dynamic';
import { Button } from '@nextui-org/react';
import CommentItem from '@/components/video/CommentItem';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import { BiSolidLike, BiSolidPencil } from 'react-icons/bi';
import { videoApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { ReportModal } from '@/components/modal';
interface VideoProps {
    params: { id: number };
}

const Video: React.FC<VideoProps> = ({ params }) => {
    const { data, isLoading } = useQuery<any>({
        queryKey: ['video-teacher-detail', params?.id],
        queryFn: () => videoApi.getVideoDetailByIdForAdminAndTeacher(params?.id)
    });
    console.log(params?.id);
    console.log(data);

    if (!data) return <Loader />;
    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button as={Link} size="sm" href="/teacher/video/my-video">
                        <BsArrowLeft />
                    </Button>
                    <p className="text-blue-700 text-xs sm:text-base font-semibold">{data?.name}</p>
                </div>
                <div className="flex justify-center items-center text-black">
                    <div className="hidden lg:block">
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
                            className="ml-4 text-black hover:text-black"
                        >
                            Chỉnh sửa <BiSolidPencil />
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
                            <h3 className="font-semibold text-lg">Bình luận</h3>
                            <ul className="mt-6 px-0 sm:px-4">
                                {/* <CommentItem />
                                <CommentItem />
                                <CommentItem /> */}
                            </ul>
                            <Button className="w-full">Xem thêm</Button>
                        </div>
                    </div>
                </div>
            </div>
            <ReportModal />
        </>
    );
};

export default Video;
