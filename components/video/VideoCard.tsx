import { Card, CardBody, CardHeader, Chip, ChipProps, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BiSolidLike } from 'react-icons/bi';
import { PreviewVideoModal } from '../modal/PreviewVideoModal';

interface VideoCardProps {
    type?: 'teacher' | 'teacher-draft' | 'admin' | 'all';
    isTeacherVideo?: boolean;
    isTeacherVideoDraft?: boolean;
    video: any;
}

const statusColorMap: Record<string, ChipProps['color']> = {
    AVAILABLE: 'success',
    REJECT: 'danger',
    BANNED: 'danger',
    WAITING: 'primary',
    UPDATING: 'primary',
    UNAVAILABLE: 'warning',
    PUBLIC: 'success',
    PRIVATE: 'danger'
};

const calculateTimeDifference = (postTime: any) => {
    const currentTime = new Date();
    const postDateTime = postTime === null ? new Date() : new Date(postTime);
    const timeDifference = currentTime.getTime() - postDateTime.getTime();

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximate months
    const years = Math.floor(days / 365); // Approximate years

    if (years > 0) {
        return `${years} năm trước`;
    } else if (months > 0) {
        return `${months} tháng trước`;
    } else if (days > 0) {
        return `${days} ngày trước`;
    } else if (hours > 0) {
        return `${hours} giờ trước`;
    } else if (minutes > 0) {
        return `${minutes} phút trước`;
    } else {
        return 'Vừa xong';
    }
};

const floatToTime = (durationFloat: number): string => {
    if (durationFloat > 10) {
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
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    let detailPage = '',
        teacherStatus = '',
        profileStatus;
    if (type === 'teacher') {
        detailPage = `/teacher/video/${video?.id}`;
        if (video.videoStatus === 'PUBLIC') teacherStatus = 'Công Khai';
        else if (video.videoStatus === 'PRIVATE') teacherStatus = 'Không Công Khai';
        // if (video.status === 'AVAILABLE') teacherStatus = 'Hoạt động';
        // else if (video.status === 'WAITING') teacherStatus = 'Chờ xác thực';
        // else if (video.status === 'REJECT') teacherStatus = 'Đã từ chối';
        // else if (video.status === 'BANNED') teacherStatus = 'Đã xóa';
        // else if (video.status === 'UPDATING') teacherStatus = 'Chờ cập nhật';
        else teacherStatus = 'Vô hiệu';
    } else if (type === 'teacher-draft') {
        detailPage = `/teacher/video/my-video-draft/${video?.id}`;
        if (video.videoStatus === 'PUBLIC') teacherStatus = 'Công Khai';
        else if (video.videoStatus === 'PRIVATE') teacherStatus = 'Không Công Khai';
        else teacherStatus = 'Vô hiệu';
    } else detailPage = `/video/${video.id}`;
    if (type === 'all') {
        if (video.videoStatus === 'PUBLIC') profileStatus = 'Xem trước';
        else if (video.isAccess === true) profileStatus = 'Đã mua';
        else profileStatus = 'Đang khóa';
    } else if (type === 'admin') {
        if (video.videoStatus === 'PUBLIC') profileStatus = 'Công khai';
        else profileStatus = 'Không công khai';
    }

    const viewDetailVideo = () => {
        if (type === 'all' && video.videoStatus === 'PUBLIC') {
            onOpen();
        } else if (type === 'teacher') router.push(detailPage);
        else if (type === 'teacher-draft') router.push(detailPage);
    };

    return (
        <div className="w-full">
            <Card
                shadow="sm"
                isPressable={!(type === 'all' && video.videoStatus === 'PRIVATE')}
                className="w-full max-w-[216px] mt-4 mx-1"
            >
                <div onClick={viewDetailVideo}>
                    <CardHeader className="relative overflow-visible p-0">
                        <Image
                            height={216}
                            width={384}
                            alt=""
                            className="rounded-xl object-cover object-center h-[120px]"
                            src={video?.thumbnail || '/banner/slide-1.png'}
                        />
                        <div className="absolute bottom-0 right-1 text-xs text-white bg-gray-600 rounded-md p-1">
                            {floatToTime(video?.duration)}
                        </div>
                    </CardHeader>
                    <CardBody className="text-small justify-between p-3">
                        <b className="text-[14px] h-[40px] font-semibold truncate2line text-black">{video?.name}</b>
                        <div className="mt-[7px] text-xs">
                            <span className="text-black">{calculateTimeDifference(video?.createdDate)}</span>
                            <span className="before:content-['•'] before:inline-block before:text-gray-500 inline-flex item before:mx-2 text-black">
                                <span className="text-black">{video?.like}</span>
                                <BiSolidLike className="text-sm text-blue-300 ml-2" />
                            </span>
                        </div>
                        {type === 'teacher' || type === 'teacher-draft' ? (
                            <Chip
                                className="capitalize border-none p-0 mt-3 ml-[-4px] text-default-600 !text-xs"
                                color={statusColorMap[video?.videoStatus as string]}
                                size="sm"
                                variant="dot"
                            >
                                {teacherStatus}
                            </Chip>
                        ) : null}
                        {type === 'all' || type === 'admin' ? (
                            <Chip
                                className="capitalize border-none p-0 mt-3 ml-[-4px] text-default-600 !text-xs"
                                color={video.videoStatus === 'PUBLIC' ? 'success' : 'danger'}
                                size="sm"
                                variant="dot"
                            >
                                {profileStatus}
                            </Chip>
                        ) : null}
                    </CardBody>
                </div>
            </Card>
            <PreviewVideoModal
                name={video.name}
                url={video.videoUrl}
                onOpen={onOpen}
                isOpen={isOpen}
                onClose={onClose}
                onOpenChange={onOpenChange}
            />
        </div>
    );
};

export default VideoCard;
