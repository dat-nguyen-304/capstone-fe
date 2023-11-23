'use client';

import { discussionApi } from '@/api-client';
import Loader from '@/components/Loader';
import PostTitle from '@/components/discussion/PostTitle';
import CommentItem from '@/components/video/CommentItem';
import { CommentCardType } from '@/types';
import { Card, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BsArrowLeft } from 'react-icons/bs';

interface PostDetailProps {
    params: { id: number };
}

const PostDetail: React.FC<PostDetailProps> = ({ params }) => {
    const router = useRouter();
    const { data: discussionData } = useQuery({
        queryKey: ['discussionDetail'],
        queryFn: () => discussionApi.getDiscussionById(params?.id)
    });

    const { data: commentsData } = useQuery({
        queryKey: ['commentsByDiscussion'],
        queryFn: () => discussionApi.getCommentsByDiscussionId(params?.id)
    });

    const postContent = {
        id: discussionData?.id,
        title: discussionData?.title,
        content: discussionData?.content,
        image: discussionData?.imageUrl,
        owner: discussionData?.owner,
        auth: discussionData?.ownerFullName,
        like: discussionData?.reactCount,
        avatar: discussionData?.ownerAvatar,
        createTime: discussionData?.createTime
    };
    const commonInfo = {
        id: 1,
        ownerFullName: 'Nguyễn Văn A',
        imageUrl: '/banner/slide-1.png',
        content: 'Nội dung rất hay'
    };
    if (!discussionData) return <Loader />;
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto mb-8">
            <div className="flex justify-between items-center">
                <div onClick={() => router.back()} className="flex items-center gap-2 text-sm cursor-pointer">
                    <BsArrowLeft />
                    <span>Quay lại</span>
                </div>
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
                        {commentsData?.data?.length ? (
                            commentsData?.data?.map((commentInfo: CommentCardType) => (
                                <CommentItem key={commentInfo?.id} commentInfo={commentInfo} />
                            ))
                        ) : (
                            <>
                                <CommentItem commentInfo={commonInfo} />
                            </>
                        )}
                    </ul>
                    {/* <Button className="w-full">Xem thêm</Button> */}
                </Card>
            </div>
        </div>
    );
};

export default PostDetail;
