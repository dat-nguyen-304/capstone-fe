'use client';

import PostComment from '@/components/discuss/PostComment';
import { Button, Pagination, Tab, Tabs } from '@nextui-org/react';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface PostDetailProps {}

const PostDetail: React.FC<PostDetailProps> = ({}) => {
    return (
        <div className="w-4/5 mx-auto my-8">
            <div className="flex justify-between items-center mt-2">
                <Link href="/discuss" className="flex items-center gap-2 text-sm">
                    <BsArrowLeft />
                    <span>Quay lại</span>
                </Link>
                <Button size="sm" color="danger">
                    Báo cáo vi phạm
                </Button>
            </div>
            <PostComment title="Bàn luận về abcxyz" />
            <div>
                <ReactQuill placeholder="Viết suy nghĩ của bạn ..." tabIndex={4} />
                <div className="flex flex-row-reverse mt-4">
                    <Button size="sm" color="primary">
                        Gửi
                    </Button>
                </div>
            </div>
            <h4 className="text-sm font-semibold">Sắp xếp theo</h4>
            <div className="w-full">
                <Tabs
                    placeholder="abc"
                    aria-label="Options"
                    color="primary"
                    variant="underlined"
                    classNames={{
                        tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                        cursor: 'w-full bg-[#22d3ee]',
                        tab: 'max-w-fit px-0 h-12',
                        tabContent: 'group-data-[selected=true]:text-[#06b6d4]'
                    }}
                >
                    <Tab
                        key="photos"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Thời gian</span>
                            </div>
                        }
                    >
                        <PostComment />
                    </Tab>
                    <Tab
                        key="music"
                        title={
                            <div className="flex items-center space-x-2">
                                <span>Tương tác</span>
                            </div>
                        }
                    >
                        <PostComment />
                    </Tab>
                </Tabs>
                <div className="flex justify-center my-8">
                    <Pagination total={10} />
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
