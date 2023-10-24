'use client';

import VideoItem from './VideoItem';

interface VideoListProps {
    isOnDrawer?: boolean;
}

const VideoList: React.FC<VideoListProps> = ({ isOnDrawer }) => {
    return (
        <div className="py-4">
            <ul className={!isOnDrawer ? 'h-[450px] overflow-y-scroll' : ''}>
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
                <VideoItem />
            </ul>
        </div>
    );
};

export default VideoList;
