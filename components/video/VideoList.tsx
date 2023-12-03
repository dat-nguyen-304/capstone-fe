'use client';

import { VideoCardType } from '@/types';
import VideoItem from './VideoItem';

interface VideoListProps {
    isOnDrawer?: boolean;
    video?: VideoCardType[];
    courseId?: any;
}

const VideoList: React.FC<VideoListProps> = ({ isOnDrawer, video, courseId }) => {
    return (
        <div className="py-4">
            <ul className={!isOnDrawer ? 'h-[450px] overflow-y-scroll' : ''}>
                {video?.map((videoItem, index) => (
                    <VideoItem key={index} videoItem={videoItem} index={index} courseId={courseId} />
                ))}
            </ul>
        </div>
    );
};

export default VideoList;
