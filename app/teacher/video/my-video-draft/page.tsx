'use client';

import React, { useEffect, useState } from 'react';

import VideoCard from '@/components/video/VideoCard';
import { videoApi } from '@/api-client';
import { useSelectedSidebar } from '@/hooks';
import { VideoCardType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Pagination,
    Selection
} from '@nextui-org/react';
import { BsChevronDown } from 'react-icons/bs';
import { capitalize } from '@/components/table/utils';
import Loader from '@/components/Loader';
interface MyVideoDraftProps {}

const MyVideoDraft: React.FC<MyVideoDraftProps> = ({}) => {
    const [videos, setVideos] = useState<VideoCardType[]>([]);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const [sortFilter, setSortFilter] = useState<Selection>(new Set(['DEFAULT']));
    const { status, data } = useQuery({
        queryKey: ['my-videos-draft', { page, sortFilter: Array.from(sortFilter)[0] as string }],
        queryFn: () =>
            videoApi.getAllOfTeacherDraft(
                page - 1,
                20,
                'createdDate',
                Array.from(sortFilter)[0] === 'DEFAULT' ? 'DESC' : 'ASC'
            )
    });

    useEffect(() => {
        if (data?.data) {
            setVideos(data.data);
            setTotalPage(data.totalPage);
            setTotalRow(data.totalRow);
        }
    }, [data?.data]);

    const { onTeacherKeys } = useSelectedSidebar();

    useEffect(() => {
        setPage(1);
    }, [sortFilter]);

    useEffect(() => {
        onTeacherKeys(['5']);
    }, []);

    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };

    const mapCommentToCommonInfo = (videos: any) => {
        return {
            id: videos?.id,
            thumbnail: videos?.thumbnail,
            name: videos?.name,
            duration: videos?.duration,
            like: 0,
            createdDate: String(videos?.createdDate) || String(new Date()),
            status: '',
            videoStatus: videos?.videoStatus ? videos?.videoStatus : 'PUBLIC',
            isAccess: videos?.isAccess
        };
    };

    if (!data) return <Loader />;

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Video nháp</h3>
            <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                <div className="mt-8 sm:flex items-center justify-between gap-3 ">
                    {/* <Input
                        isClearable
                        className="w-full sm:max-w-[50%] border-1"
                        placeholder="Tìm kiếm..."
                        color="primary"
                        startContent={<BsSearch className="text-default-300" />}
                        // value={filterValue}
                        variant="bordered"
                        onClear={() => {}}
                        // onValueChange={onSearchChange}
                    />
                    <div className="flex-[1] flex flex-row-reverse">
                        <Select
                            size="sm"
                            labelPlacement="inside"
                            label="Khóa học"
                            color="primary"
                            variant="bordered"
                            className="w-4/5"
                            onChange={event => setSelectedCourse(Number(event.target.value))}
                        >
                            {coursesData?.data?.map((course: Course) => (
                                <SelectItem key={course?.id} value={course?.id}>
                                    {course?.courseName}
                                </SelectItem>
                            ))}
                        </Select>
                    </div> */}
                </div>
                <div className="flex flex-row-reverse mt-4">
                    <Dropdown>
                        <DropdownTrigger className="flex">
                            <Button
                                endContent={<BsChevronDown className="text-small" />}
                                size="md"
                                color="primary"
                                variant="bordered"
                            >
                                Sắp Xếp Theo
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={sortFilter}
                            selectionMode="single"
                            onSelectionChange={setSortFilter}
                        >
                            <DropdownItem key="DEFAULT" className="capitalize">
                                {capitalize('Video mới nhất')}
                            </DropdownItem>
                            <DropdownItem key="CREATEDDATE" className="capitalize">
                                {capitalize('Video cũ nhất')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <p className="mt-4 text-default-400 text-xs sm:text-sm">
                    {totalRow ? `Tìm thấy ${totalRow} kết quả` : 'Không tìm thấy kết quả'}
                </p>
                <div className="min-h-[300px] mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {videos?.length
                        ? videos?.map((videoItem: VideoCardType) => (
                              // <VideoCard type="teacher" key={videoItem?.id} video={videoItem} />
                              <VideoCard
                                  type="teacher-draft"
                                  key={videoItem?.id}
                                  video={mapCommentToCommonInfo(videoItem)}
                              />
                          ))
                        : null}
                </div>
                {totalPage && totalPage > 1 ? (
                    <div className="flex justify-center my-8">
                        <Pagination page={page} total={totalPage} onChange={value => scrollToTop(value)} showControls />
                    </div>
                ) : null}
            </Spin>
        </div>
    );
};

export default MyVideoDraft;
