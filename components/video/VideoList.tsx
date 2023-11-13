'use client';

import { VideoCardType } from '@/types';
import VideoItem from './VideoItem';

interface VideoListProps {
    isOnDrawer?: boolean;
    video?: VideoCardType[];
}

const VideoList: React.FC<VideoListProps> = ({ isOnDrawer, video }) => {
    return (
        <div className="py-4">
            <ul className={!isOnDrawer ? 'h-[450px] overflow-y-scroll' : ''}>
                {video?.map((videoItem, index) => <VideoItem key={index} videoItem={videoItem} index={index} />)}
            </ul>
        </div>
    );
};

export default VideoList;
