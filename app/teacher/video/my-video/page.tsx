'use client';

import React from 'react';

import VideoCard from '@/components/video/VideoCard';

interface MyVideoProps {}

const MyVideo: React.FC<MyVideoProps> = ({}) => {
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Video của tôi</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <VideoCard isTeacherVideo={true} />
                <VideoCard isTeacherVideo={true} />
                <VideoCard isTeacherVideo={true} />
                <VideoCard isTeacherVideo={true} />
                <VideoCard isTeacherVideo={true} />
                <VideoCard isTeacherVideo={true} />
            </div>
        </div>
    );
};

export default MyVideo;
