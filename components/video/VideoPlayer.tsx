import { VideoCardType } from '@/types';
import ReactPlayer from 'react-player/lazy';

interface VideoPlayerProps {
    playerRef: React.MutableRefObject<any>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    url: string;
    handleProgress: (progress: any) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ playerRef, isPlaying, setIsPlaying, url, handleProgress }) => {
    return (
        <ReactPlayer
            ref={playerRef}
            playing={isPlaying}
            width="100%"
            height="450px"
            className="object-contain"
            controls={true}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            url={url || 'https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5'}
            onProgress={progress => handleProgress(progress)}
        />
    );
};

export default VideoPlayer;
