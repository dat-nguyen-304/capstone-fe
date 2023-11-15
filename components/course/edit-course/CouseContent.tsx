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

type VideoItem = {
    id: number;
    name: string;
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
    courseContent?: {
        teacherName: string;
        courseName: string;
        totalVideo: number;
        listVideo: VideoItem[];
    };
}

const CourseContent: React.FC<CourseContentProps> = ({ courseContent }) => {
    const arrays = courseContent?.listVideo.map((video, index) => {
        return {
            ...video,
            index: index + 1
        };
    });
    const [activeItem, setActiveItem] = useState<VideoSortItemType | null>(null);
    const [items, setItems] = useState<VideoSortItemType[]>(arrays || []);

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
        }
        setActiveItem(null);
    }
    return (
        <div className="xl:grid grid-cols-10 mt-6">
            <div className="hidden xl:block col-span-3 p-4 border-2 border-gray-200 rounded-xl sticky top-[70px] h-[420px]">
                <Image src="/banner/slide-1.png" alt="" width={300} height={240} />
                <h2 className="truncate2line font-bold text-lg mt-4">{courseContent?.courseName}</h2>
                <h3 className="mt-1 font-semibold">{courseContent?.teacherName}</h3>
                <div className="mt-4">
                    <span className="inline-flex items-center">
                        <span className="text-sm font-bold mr-1">{courseContent?.totalVideo}</span>
                        <span className="text-sm mr-1">Bài giảng</span>
                        <Image src="/video-number/blue.svg" width={25} height={25} alt="" />
                    </span>
                    <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                        <span className="inline-flex items-center">
                            <span className="text-sm font-bold mr-1">5</span>
                            <span className="text-sm mr-1">Bài tập</span>
                            <Image src="/video-number/red.svg" width={25} height={25} alt="" />
                        </span>
                    </span>
                </div>
                <div className="mt-1 text-xs">Cập nhật 6 giờ trước</div>
                <div className="mt-6 flex justify-evenly">
                    <Button as={Link} href="/teacher/video/upload" color="primary" size="sm">
                        Thêm video
                    </Button>
                    <Button as={Link} href="/teacher/quiz/create" color="primary" size="sm">
                        Thêm bài tập
                    </Button>
                </div>
            </div>
            <div className="col-span-7 mx-0 xl:mx-[40px]">
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
    );
};

export default CourseContent;
