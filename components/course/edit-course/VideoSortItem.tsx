'use client';

import Image from 'next/image';
import { AiOutlineMenu } from 'react-icons/ai';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import Link from 'next/link';
import { useCustomModal } from '@/hooks';
interface VideoSortItemProps {
    videoItem: {
        id: number;
        name: string;
        duration: number;
        totalComment: number;
        totalLike: number;
        thumbnail: string;
    };
    index: UniqueIdentifier;
}

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

const VideoSortItem: React.FC<VideoSortItemProps> = ({ videoItem, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: index,
        data: {
            type: 'item'
        }
    });
    const { onOpen, onDanger } = useCustomModal();

    const removeVideo = () => {
        onDanger({
            title: 'Xác nhận xóa video',
            content: 'Bạn sẽ không nhìn thấy video sau khi xóa. Bạn chắc chứ?'
        });
        onOpen();
    };

    return (
        <li
            className="flex p-1 sm:p-4 rounded-xl border-2 items-center my-1 bg-gray-100"
            ref={setNodeRef}
            {...attributes}
            style={{
                transition,
                transform: CSS.Translate.toString(transform)
            }}
        >
            <Image
                src={'/video-number/blue.svg'}
                width={40}
                height={40}
                alt=""
                className="w-[24px] h-[24px] sm:w-[40px] sm:h-[40px]"
            />
            <div className="h-[50px] w-[100px] ml-0 sm:ml-4 relative">
                <Image src={videoItem?.thumbnail || '/banner/slide-1.png'} alt="" width={300} height={240} />
                <span className="absolute bottom-0 text-white bg-gray-700 px-1 rounded-md right-0 text-xs">
                    {floatToTime(videoItem?.duration)}
                </span>
            </div>
            <div className="max-w-[50%] flex flex-col justify-between ml-1 sm:ml-4">
                <h3 className="font-semibold truncate text-xs sm:text-sm">{videoItem?.name}</h3>
                <div>
                    <span className="text-xs"> 7 ngày trước</span>
                </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <div className="block sm:hidden" {...listeners}>
                    <AiOutlineMenu />
                </div>
                <div
                    className="block border-1 border-gray-400 bg-gray-100 py-2 px-4 rounded-xl hidden sm:flex"
                    {...listeners}
                >
                    <AiOutlineMenu />
                </div>
                <div>
                    <Dropdown className="bg-background border-1 border-default-200">
                        <DropdownTrigger>
                            <Button isIconOnly radius="full" size="sm" variant="light">
                                <BsThreeDotsVertical className="text-default-400" />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Table Columns">
                            <DropdownItem color="primary" as={Link} href={`/teacher/video/${videoItem.id}`}>
                                Xem chi tiết
                            </DropdownItem>
                            <DropdownItem color="warning" as={Link} href={`/teacher/video/edit/${videoItem.id}`}>
                                Chỉnh sửa
                            </DropdownItem>
                            <DropdownItem color="danger" onClick={removeVideo}>
                                Xóa
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </li>
    );
};

export default VideoSortItem;
