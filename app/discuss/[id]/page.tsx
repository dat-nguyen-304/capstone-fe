'use client';

import PostComment from '@/components/discuss/PostComment';
import { Button, Pagination, Select, SelectItem } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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
            <div className="w-full">
                <Select
                    size="sm"
                    label="Sắp xếp theo"
                    color="primary"
                    variant="bordered"
                    defaultSelectedKeys={['0']}
                    className="w-[240px] mt-4"
                >
                    <SelectItem key={0} value={0}>
                        Thời gian
                    </SelectItem>
                    <SelectItem key={1} value={1}>
                        Tương tác
                    </SelectItem>
                </Select>
                <PostComment />
                <div className="flex justify-center my-8">
                    <Pagination total={10} />
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
