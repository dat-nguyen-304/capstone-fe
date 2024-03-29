'use client';

import Image from 'next/image';
import VideoSortItem from './VideoSortItem';
import { Button } from '@nextui-org/react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    UniqueIdentifier,
    closestCorners,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { examApi, videoApi } from '@/api-client';

type VideoItem = {
    id: number;
    name: string;
    isDraft: boolean;
    duration: number;
    totalComment: number;
    totalLike: number;
    thumbnail: string;
    ordinalNumber: number;
};

type VideoSortItemType = VideoItem & {
    index: UniqueIdentifier;
};
interface CourseContentProps {
    courseContent: any;
    setVideoOrders: React.Dispatch<React.SetStateAction<{ videoId: number; videoOrder: number; isDraft: boolean }[]>>;
    refetch?: any;
}
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
const CourseContent: React.FC<CourseContentProps> = ({ courseContent, setVideoOrders, refetch }) => {
    const arrays = courseContent?.listVideo?.map((video: any, index: number) => {
        return {
            ...video,
            index: index + 1
        };
    });
    const [sortOrders, setSortOrders] = useState<any[]>([]);
    const [activeItem, setActiveItem] = useState<VideoSortItemType | null>(null);
    const [items, setItems] = useState<VideoSortItemType[]>(arrays || []);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // DND Handlers
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    function handleDragStart(event: DragStartEvent) {
        const id = event.active.id;
        const item = items.find(item => item.index === id);
        setActiveItem(item as VideoSortItemType);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over?.id) {
            const activeIndex = items.findIndex(({ index }) => index === active.id);
            const overIndex = items.findIndex(({ index }) => index === over.id);
            setItems(arrayMove(items, activeIndex, overIndex));

            const updatedVideoOrders = arrayMove(items, activeIndex, overIndex).map((video, index) => ({
                videoId: video.id,
                videoOrder: index + 1,
                isDraft: video?.isDraft
            }));
            setVideoOrders(updatedVideoOrders);
            setSortOrders(updatedVideoOrders);
        }
        setActiveItem(null);
    }
    const handleButtonClick = async () => {
        const case1 = sortOrders.filter(video => video.isDraft !== undefined);
        const case2 = sortOrders
            .filter(video => video.isDraft === undefined)
            .map(video => ({ quizId: video.videoId, order: video.videoOrder }));
        const toastLoading = toast.loading('Đang gửi yêu cầu');
        setIsSubmitting(true);
        try {
            if (
                courseContent?.status == 'DRAFT' ||
                courseContent?.status == 'REJECT' ||
                courseContent?.status == 'UPDATING'
            ) {
                await videoApi.sortVideoOrder(
                    courseContent?.courseRealId !== null ? courseContent?.courseRealId : -1,
                    courseContent?.id,
                    case1
                );

                const res = await examApi.sortQuiz(case2);
                if (res) {
                    setIsSubmitting(false);
                    toast.success('Cập nhật vị trí thành công');
                    refetch();
                }
            } else {
                await videoApi.sortVideoOrder(courseContent?.id, -1, case1);
                const res = await examApi.sortQuiz(case2);
                if (res) {
                    setIsSubmitting(false);
                    toast.success('Cập nhật vị trí thành công');
                    refetch();
                }
            }
            toast.dismiss(toastLoading);
        } catch (error) {
            setIsSubmitting(false);
            toast.dismiss(toastLoading);
            console.log(error);

            toast.error('Hệ thống đang gặp trục trực. Vui lòng thử lại sau ít phút');
        }
    };
    return (
        <>
            {items && items.length > 0 ? (
                <div className="flex flex-row-reverse">
                    <Button color="primary" onClick={handleButtonClick} isLoading={isSubmitting}>
                        Lưu thay đổi
                    </Button>
                </div>
            ) : null}

            <div className="xl:grid grid-cols-10 mt-6">
                <div className="hidden xl:block col-span-3 p-4 border-2 border-gray-200 rounded-xl sticky top-[70px] h-[520px]">
                    <div>
                        <Image
                            src={courseContent?.thumbnail ? courseContent?.thumbnail : '/banner/slide-1.png'}
                            alt=""
                            width={250}
                            height={240}
                        />
                    </div>
                    <h2 className="truncate2line font-bold text-lg mt-4">{courseContent?.courseName}</h2>
                    <h3 className="mt-1 font-semibold">{courseContent?.teacherName}</h3>
                    <div className="mt-4">
                        <span className="inline-flex items-center">
                            <span className="text-sm font-bold mr-1">{courseContent?.totalVideo || 0}</span>
                            <span className="text-sm mr-1">Bài giảng</span>
                            <Image src="/video-number/blue.svg" width={25} height={25} alt="" />
                        </span>
                        <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                            <span className="inline-flex items-center">
                                <span className="text-sm font-bold mr-1">{courseContent?.totalQuiz || 0}</span>
                                <span className="text-sm mr-1">Bài tập</span>
                                <Image src="/video-number/red.svg" width={25} height={25} alt="" />
                            </span>
                        </span>
                    </div>
                    <div className="mt-1 text-xs">Cập nhật {calculateTimeDifference(courseContent?.updateDate)}</div>
                    <div className="mt-6 flex justify-evenly">
                        <Button as={Link} href="/teacher/video/upload" color="primary">
                            Thêm video
                        </Button>
                        <Button as={Link} href="/teacher/quiz/create" color="primary">
                            Thêm bài tập
                        </Button>
                    </div>
                </div>
                <div className="col-span-7 ml-0 xl:ml-[40px]">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={() => setActiveItem(null)}
                    >
                        <SortableContext items={items.map(i => i.index)}>
                            <ul>
                                {items.map(videoItem => (
                                    <VideoSortItem key={videoItem.id} videoItem={videoItem} index={videoItem.index} />
                                ))}
                            </ul>
                        </SortableContext>
                        <DragOverlay adjustScale={false}>
                            {activeItem && <VideoSortItem videoItem={activeItem} index={activeItem.index} />}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>
        </>
    );
};

export default CourseContent;
