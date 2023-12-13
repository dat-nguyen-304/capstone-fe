'use client';

import { videoApi } from '@/api-client';
import { VideoCardType } from '@/types';
import { Pagination } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import VideoCard from '../video/VideoCard';
import Loader from '../Loader';
import { Spin } from 'antd';

interface VideoTabProps {
    teacher: string;
    type?: 'teacher' | 'teacher-draft' | 'admin' | 'all';
}
const VideoTab: React.FC<VideoTabProps> = ({ teacher, type }) => {
    const [videos, setVideos] = useState<VideoCardType[]>([]);

    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: ['video-profile', { page }],
        queryFn: () => videoApi.getVideoForPublicProfile(teacher, page - 1, 20)
    });

    useEffect(() => {
        if (data?.data) {
            setVideos(data.data);
        }
    }, [data]);

    if (!data && videos.length === 0) return <Loader />;

    return (
        <div>
            <Spin spinning={isLoading ? true : false} size="large" tip="Đang tải">
                {data?.totalRow ? (
                    <p className="mt-4 text-default-400 text-xs sm:text-sm">Tìm thấy {data.totalRow} kết quả</p>
                ) : null}
                <div className="mt-2 py-2 px-2">
                    <div className="min-h-[300px] mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {videos.length ? (
                            videos.map((videoItem: VideoCardType) => (
                                <VideoCard type={type || 'all'} key={videoItem?.id} video={videoItem} />
                            ))
                        ) : (
                            <div className="mt-4 text-default-400 text-xs sm:text-sm">Danh Sách Video Trống</div>
                        )}
                    </div>
                    <div className="flex justify-center">
                        {videos.length && data?.totalPage > 1 ? (
                            <Pagination
                                showControls
                                color="primary"
                                page={page}
                                total={data.totalPage}
                                variant="light"
                                onChange={setPage}
                            />
                        ) : null}
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default VideoTab;
