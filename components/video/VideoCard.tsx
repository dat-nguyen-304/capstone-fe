import { VideoCardType } from '@/types';
import { Card, CardBody, CardHeader, Chip, ChipProps } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { BiSolidLike } from 'react-icons/bi';

interface VideoCardProps {
    type?: 'teacher' | 'teacher-draft' | 'all';
    isTeacherVideo?: boolean;
    isTeacherVideoDraft?: boolean;
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
    if (durationFloat > 100) {
        const hours = Math.floor(durationFloat / 3600);
        const minutes = Math.floor((durationFloat % 3600) / 60);
        const seconds = Math.floor(durationFloat % 60);

        const formattedHours = hours > 0 ? `${hours}:` : '';
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();
        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    } else {
        const totalSeconds = Math.round(durationFloat * 3600);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = hours > 0 ? `${hours}:` : '';
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();
        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    }
};

const VideoCard: React.FC<VideoCardProps> = ({ type, video }) => {
    let detailPage = '',
        teacherStatus = '',
        profileStatus;
    if (type === 'teacher') {
        detailPage = `/teacher/video/${video?.id}`;
        if (video.status === 'AVAILABLE') teacherStatus = 'Hoạt động';
        else if (video.status === 'WAITING') teacherStatus = 'Chờ xác thực';
        else if (video.status === 'REJECT') teacherStatus = 'Đã từ chối';
        else if (video.status === 'BANNED') teacherStatus = 'Đã xóa';
        else if (video.status === 'UPDATING') teacherStatus = 'Chờ cập nhật';
        else teacherStatus = 'Vô hiệu';
    } else if (type === 'teacher-draft') detailPage = `/teacher/video/my-video-draft/${video?.id}`;
    else detailPage = `/video/${video.id}`;
    if (type === 'all') {
        if (video.videoStatus === 'PUBLIC') profileStatus = 'Xem trước';
        else if (video.isAccess === true) profileStatus = 'Đã mua';
        else profileStatus = 'Đang khóa';
    }

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
                    <CardBody className="text-small justify-between p-3">
                        <b className="text-[14px] h-[40px] font-semibold truncate2line text-black">{video?.name}</b>
                        <div className="mt-[7px] text-xs">
                            <span className="text-black">2 tháng trước</span>
                            <span className="before:content-['•'] before:inline-block before:text-gray-500 inline-flex item before:mx-2 text-black">
                                <span className="text-black">{video?.like}</span>
                                <BiSolidLike className="text-sm text-blue-300 ml-2" />
                            </span>
                        </div>
                        {type === 'teacher' && (
                            <Chip
                                className="capitalize border-none p-0 mt-3 ml-[-4px] text-default-600 !text-xs"
                                color={statusColorMap[video?.status as string]}
                                size="sm"
                                variant="dot"
                            >
                                {teacherStatus}
                            </Chip>
                        )}
                        {type === 'all' && (
                            <Chip
                                className="capitalize border-none p-0 mt-3 ml-[-4px] text-default-600 !text-xs"
                                color={profileStatus === 'Đang khóa' ? 'danger' : 'success'}
                                size="sm"
                                variant="dot"
                            >
                                {profileStatus}
                            </Chip>
                        )}
                    </CardBody>
                </Link>
            </Card>
        </div>
    );
};

export default VideoCard;
