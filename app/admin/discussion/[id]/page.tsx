'use client';

import PostTitle from '@/components/discussion/PostTitle';
import CommentItem from '@/components/video/CommentItem';
import { Button, Card, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';

interface PostDetailProps {}

const PostDetail: React.FC<PostDetailProps> = ({}) => {
    const postContent = {
        id: 1,
        title: 'Bàn luận về abcxyz',
        content: 'string',
        image: undefined,
        owner: true,
        auth: 'Jane Doe'
    };
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto mb-8">
            <div className="flex justify-between items-center">
                <Link href="/admin/discussion" className="flex items-center gap-2 text-sm">
                    <BsArrowLeft />
                    <span>Quay lại</span>
                </Link>
            </div>
            <PostTitle postContent={postContent} from="admin" />
            <div className="w-full mt-12">
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
                <Card className="mt-8 p-8">
                    <ul>
                        {/* <CommentItem />
                        <CommentItem />
                        <CommentItem />
                        <CommentItem />
                        <CommentItem />
                        <CommentItem /> */}
                    </ul>
                    <Button className="w-full">Xem thêm</Button>
                </Card>
            </div>
        </div>
    );
};

export default PostDetail;
