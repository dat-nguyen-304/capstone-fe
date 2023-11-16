import { VideoCardType } from '@/types';
import { Card, CardBody, CardHeader, Chip, ChipProps } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { BiSolidLike } from 'react-icons/bi';

interface VideoCardProps {
    isTeacherVideo?: boolean;
    video: VideoCardType;
}

const statusColorMap: Record<string, ChipProps['color']> = {
    AVAILABLE: 'success',
    REJECT: 'danger',
    BANNED: 'danger',
    WAITING: 'primary',
    UPDATING: 'primary',
    UNAVAILABLE: 'warning'
};

const floatToTime = (durationFloat: number): string => {
    const totalSeconds = Math.round(durationFloat * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours > 0 ? `${hours}:` : '';
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};

const VideoCard: React.FC<VideoCardProps> = ({ isTeacherVideo, video }) => {
    let detailPage = '';
    if (isTeacherVideo) detailPage = `/teacher/video/${video?.id}`;
    else detailPage = '/video/1';

    return (
        <div className="flex justify-center w-full">
            <Card shadow="sm" isPressable className="w-full max-w-[216px] mt-4 mx-1">
                <Link href={detailPage}>
                    <CardHeader className="overflow-visible p-0 h-[120px] relative">
                        <Image
                            height={200}
                            width={200}
                            alt=""
                            className="w-full object-contain h-[120px]"
                            src={video?.thumbnail || '/banner/slide-1.png'}
                        />
                        <div className="absolute bottom-0 right-1 text-xs text-white bg-gray-600 rounded-md p-1">
                            {floatToTime(video?.duration)}
                        </div>
                    </CardHeader>
                    <CardBody className="text-small justify-between p-4">
                        <b className="text-[15px] h-[40px] font-semibold truncate2line text-black">{video?.name}</b>
                        <div className="mt-1 text-xs">
                            <span className="text-black">2 tháng trước</span>
                            <span className="before:content-['•'] before:inline-block before:text-gray-500 inline-flex item before:mx-2 text-black">
                                <span className="text-black">{video?.like}</span>
                                <BiSolidLike className="text-sm text-blue-300 ml-2" />
                            </span>
                        </div>
                        {isTeacherVideo && (
                            <Chip
                                className="capitalize border-none p-0 mt-3 ml-[-4px] text-default-600 !text-xs"
                                color={statusColorMap[video?.status as string]}
                                size="sm"
                                variant="dot"
                            >
                                {video?.status === 'AVAILABLE'
                                    ? 'Hoạt động'
                                    : video?.status === 'WAITING'
                                    ? 'Chờ xác thực'
                                    : video?.status === 'REJECT'
                                    ? 'Đã từ chối'
                                    : video?.status === 'BANNED'
                                    ? 'Đã Xóa'
                                    : video?.status === 'UPDATING'
                                    ? 'Chờ cập nhật'
                                    : 'Vô hiệu'}
                            </Chip>
                        )}
                    </CardBody>
                </Link>
            </Card>
        </div>
    );
};

export default VideoCard;
