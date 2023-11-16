'use client';

import React, { useEffect, useState } from 'react';

import VideoCard from '@/components/video/VideoCard';
import { videoApi } from '@/api-client';
import { useUser } from '@/hooks';
import { VideoCardType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { Pagination } from '@nextui-org/react';
interface MyVideoProps {}

const MyVideo: React.FC<MyVideoProps> = ({}) => {
    const [videos, setVideos] = useState<VideoCardType[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const currentUser = useUser();
    const { status, error, data, isPreviousData } = useQuery({
        queryKey: ['my-videos', { page }],
        // keepPreviousData: true,
        queryFn: () => videoApi.getAllOfTeacher(currentUser.user?.email as string, 'ALL', page - 1, 20)
    });
    useEffect(() => {
        if (data?.data) {
            setVideos(data.data);
            setTotalPage(data.totalPage);
            setTotalRow(data.totalRow);
        }
    }, [data]);
    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Video của tôi</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                {totalRow && <p className="mt-6 text-sm font-semibold">Tìm thấy {totalRow} kết quả</p>}
                <div className="min-h-[300px] mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {videos.length ? (
                        videos.map((videoItem: VideoCardType) => (
                            <VideoCard isTeacherVideo={true} key={videoItem?.id} video={videoItem} />
                        ))
                    ) : (
                        <>Danh Sách Video Trống</>
                    )}
                </div>
                {totalPage && (
                    <div className="flex justify-center my-8">
                        <Pagination page={page} total={totalPage} onChange={value => scrollToTop(value)} showControls />
                    </div>
                )}
            </Spin>
        </div>
    );
};

export default MyVideo;
