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
import { useRouter } from 'next/navigation';
import HTMLReactParser from 'html-react-parser';
interface VideoDraftProps {
    params: { id: number };
}

const AdminReviewVideoDraft: React.FC<VideoDraftProps> = ({ params }) => {
    const { data, isLoading } = useQuery<any>({
        queryKey: ['admin-review-video--detail', { params: params?.id }],
        queryFn: () => videoApi.getVideoDraftById(params?.id)
    });
    const router = useRouter();
    const goBack = () => {
        router.back();
    };
    const onSubmitReport = async () => {};
    if (!data) return <Loader />;
    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button size="sm" onClick={goBack}>
                        <BsArrowLeft />
                    </Button>
                    <p className="text-blue-700 text-xs sm:text-base font-semibold">{data?.name}</p>
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
                        <div className="mt-8 px-0 sm:px-4">
                            <h3 className="mt-16 mb-8 font-semibold text-lg text-slate-800">Mô tả video</h3>
                            <p>{HTMLReactParser(data?.description)}</p>
                            {data?.material ? (
                                <>
                                    <h4 className="mt-16 mb-8 font-semibold text-lg text-slate-800">
                                        Tài liệu học thuật:
                                        <span className="text-medium text-blue-400 underline">
                                            <Link href={data?.material} target="_blank">
                                                {' '}
                                                tài liệu
                                            </Link>
                                        </span>
                                    </h4>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <ReportModal onReport={onSubmitReport} />
        </>
    );
};

export default AdminReviewVideoDraft;
