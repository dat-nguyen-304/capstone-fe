'use client';

import { discussionApi } from '@/api-client';
import Loader from '@/components/Loader';
import PostTitle from '@/components/discussion/PostTitle';
import CommentItem from '@/components/video/CommentItem';
import { useCustomModal } from '@/hooks';
import { CommentCardType } from '@/types';
import { Button, Card, Pagination, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { PuffLoader } from 'react-spinners';

interface PostDetailProps {
    params: { id: number };
}

const PostDetail: React.FC<PostDetailProps> = ({ params }) => {
    const router = useRouter();
    const [comments, setComments] = useState<[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [filter, setFilter] = useState<number>(0);
    const { data: discussionData, refetch: refetchDiscussion } = useQuery({
        queryKey: ['discussionDetail', { params: params?.id }],
        queryFn: () => discussionApi.getDiscussionById(params?.id)
    });

    const {
        data: commentsData,
        refetch,
        isLoading
    } = useQuery({
        queryKey: ['adminCommentsByDiscussion', { params: params?.id, page, filter }],
        queryFn: () =>
            discussionApi.getCommentsByDiscussionId(
                params?.id,
                page - 1,
                rowsPerPage,
                filter == 1 ? 'reactCount' : 'createTime',
                'DESC'
            )
    });
    useEffect(() => {
        if (commentsData?.data) {
            setComments(commentsData.data);
            setTotalPage(commentsData.totalPage);
            setTotalRow(commentsData.totalRow);
        }
    }, [commentsData]);
    const postContent = {
        id: discussionData?.id,
        title: discussionData?.title,
        content: discussionData?.content,
        imageUrl: discussionData?.imageUrl,
        owner: discussionData?.owner,
        auth: discussionData?.ownerFullName,
        like: discussionData?.reactCount,
        avatar: discussionData?.ownerAvatar,
        createTime: discussionData?.createTime
    };

    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };
    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    const handleStatusChange = async (id: number, status: string) => {
        try {
            onLoading();
            const res = await discussionApi.updateStatusDiscussion(id, status);
            if (!res.data.code) {
                onSuccess({
                    title: `${'Đã cấm bài đăng thành công'} `,
                    content: `${'Bài đăng đã bị cấm thành công'} `
                });
                router.back();
            }
        } catch (error) {
            // Handle error
            onDanger({
                title: 'Có lỗi xảy ra',
                content: 'Hệ thống gặp trục trặc, thử lại sau ít phút'
            });
            console.error('Error changing user status', error);
        }
    };
    const onDeactivateOpen = (id: number, status: string) => {
        onDanger({
            title: `Xác nhận cấm`,
            content: `Bài đăng này sẽ không được hiện thị sau khi cấm. Bạn chắc chứ?`,
            activeFn: () => handleStatusChange(id, status)
        });
        onOpen();
    };
    if (!discussionData) return <Loader />;
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto mb-8">
            <div className="flex justify-between items-center">
                <div onClick={() => router.back()} className="flex items-center gap-2 text-sm cursor-pointer">
                    <BsArrowLeft />
                    <span>Quay lại</span>
                </div>
                <Button
                    color="danger"
                    variant="bordered"
                    size="sm"
                    onClick={() => onDeactivateOpen(discussionData?.id, 'BANNED')}
                >
                    Cấm bài đăng
                </Button>
            </div>
            <PostTitle postContent={postContent} from="admin" refetch={refetchDiscussion} />
            <div className="w-full mt-12">
                <Select
                    size="sm"
                    label="Sắp xếp theo"
                    color="primary"
                    variant="bordered"
                    defaultSelectedKeys={['0']}
                    className="w-[240px] mt-4"
                    onChange={event => setFilter(Number(event.target.value))}
                >
                    <SelectItem key={0} value={0}>
                        Thời gian
                    </SelectItem>
                    <SelectItem key={1} value={1}>
                        Tương tác
                    </SelectItem>
                </Select>
                <Card className="mt-8 p-8">
                    {isLoading ? (
                        <div className="flex justify-center">
                            <PuffLoader color="blue" size={50} />
                        </div>
                    ) : (
                        <ul>
                            {comments?.length ? (
                                comments?.map((commentInfo: any) => (
                                    <CommentItem refetch={refetch} key={commentInfo?.id} commentInfo={commentInfo} />
                                ))
                            ) : (
                                <div>Chưa có phản hồi</div>
                            )}
                            {totalPage && totalPage > 1 ? (
                                <div className="flex justify-center mb-16">
                                    <Pagination
                                        page={page}
                                        total={totalPage}
                                        onChange={value => scrollToTop(value)}
                                        showControls
                                    />
                                </div>
                            ) : null}
                        </ul>
                    )}

                    {/* <Button className="w-full">Xem thêm</Button> */}
                </Card>
            </div>
        </div>
    );
};

export default PostDetail;
