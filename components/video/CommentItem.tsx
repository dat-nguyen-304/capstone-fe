'use client';

import { Avatar, Button, Textarea, Tooltip } from '@nextui-org/react';
import { AiOutlineLike } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { CiFlag1 } from 'react-icons/ci';
import SubCommentItem from './SubCommentItem';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useState } from 'react';
import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { useReportModal } from '@/hooks';
import { CommentCardType } from '@/types';
import HTMLReactParser from 'html-react-parser';
import { IoMdSend } from 'react-icons/io';
import { discussionApi } from '@/api-client';
import { toast } from 'react-toastify';

interface CommentItemProps {
    commentInfo: CommentCardType | any;
    onCommentId?: (commentId: number) => void;
    refetch?: any;
}

const CommentItem: React.FC<CommentItemProps> = ({ commentInfo, onCommentId, refetch }) => {
    const [showSubComment, setShowSubComment] = useState<boolean>(false);
    const [showWriteResponse, setShowWriteResponse] = useState<boolean>(false);
    const [responseComment, setResponseComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { isOpen, onOpen, onClose, onContentType, onReportType, onDescription, onFile } = useReportModal();

    const onSubmit = async () => {
        let toastLoading;
        try {
            setIsSubmitting(true);
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            const formDataWithImage = new FormData();
            formDataWithImage.append('content', responseComment);
            formDataWithImage.append('commentParentId', commentInfo?.id);
            const response = await discussionApi.createComment(formDataWithImage, commentInfo?.conversationId);
            if (response) {
                if (refetch) refetch();
                setResponseComment('');
                setShowWriteResponse(false);
                setIsSubmitting(false);
                toast.success('Phản hồi thành công');
            }

            toast.dismiss(toastLoading);
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error creating course:', error);
        }
    };

    const handleLikeClick = async () => {
        let toastLoading;
        try {
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            // Assuming postContent.id is the discussionId
            if (commentInfo?.reacted) {
                const response = await discussionApi.commentRemoveReact(commentInfo?.id);
                refetch();
                if (response) {
                    toast.success('Tương tác thành công');
                }
                toast.dismiss(toastLoading);
            } else {
                const response = await discussionApi.commentReact(commentInfo?.id);
                refetch();
                if (response) {
                    toast.success('Tương tác thành công');
                }
                toast.dismiss(toastLoading);
            }
        } catch (error) {
            // Handle errors
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error reacting to discussion:', error);
        }
    };

    const openReportModal = () => {
        if (onCommentId) {
            onCommentId(commentInfo?.id);
        }
        onContentType('comment');
        onOpen();
    };

    return (
        <li className="flex gap-4 group mb-6">
            <div>
                <Avatar src={commentInfo?.ownerAvatar || 'https://i.pravatar.cc/150?u=a04258114e29026708c'} />
            </div>
            <div className="w-full">
                <div className="bg-gray-100 pt-2 pb-4 px-4 rounded-xl">
                    <h4 className="font-semibold text-sm sm:text-base">{commentInfo?.ownerFullName}</h4>
                    {commentInfo.imageUrl && (
                        <div className="my-2">
                            <Gallery>
                                <Item
                                    original={commentInfo.imageUrl || '/banner/slide-1.png'}
                                    width="1024"
                                    height="768"
                                >
                                    {({ open }) => (
                                        <Image
                                            onClick={open}
                                            src={commentInfo.imageUrl || '/banner/slide-1.png'}
                                            width={100}
                                            height={80}
                                            alt=""
                                        />
                                    )}
                                </Item>
                            </Gallery>
                        </div>
                    )}
                    <div className="text-xs sm:text-sm"> {HTMLReactParser(String(commentInfo?.content))}</div>
                </div>
                <div className="mt-1 flex gap-4 items-center">
                    <span className="flex items-center gap-2">
                        <AiOutlineLike
                            className={`${
                                !commentInfo?.reacted
                                    ? 'cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out'
                                    : commentInfo?.reacted
                                    ? 'cursor-pointer text-blue-500 hover:scale-110 transition-transform duration-200 ease-in-out'
                                    : ''
                            }`}
                            onClick={handleLikeClick}
                        />
                        <span className="text-xs sm:text-sm">{commentInfo?.reactCount || 0}</span>
                    </span>

                    <>
                        <Button variant="light" onClick={() => setShowWriteResponse(!showWriteResponse)}>
                            Phản hồi
                        </Button>
                        {commentInfo?.owner !== true ? (
                            <>
                                <Tooltip
                                    onClick={openReportModal}
                                    placement="right"
                                    content={
                                        <div className="p-1 cursor-pointer">
                                            <span className="flex items-center gap-2">
                                                <CiFlag1 /> Báo cáo vi phạm
                                            </span>
                                        </div>
                                    }
                                >
                                    <button type="button" className="group-hover:flex hidden h-[12px] !w-[20px]">
                                        <BiDotsHorizontalRounded />
                                    </button>
                                </Tooltip>
                            </>
                        ) : null}
                    </>
                </div>
                <div className="">
                    {commentInfo?.subComments?.length ? (
                        <Button variant="light" onClick={() => setShowSubComment(!showSubComment)}>
                            {showSubComment ? <BsChevronUp /> : <BsChevronDown />}
                            <span className="text-xs sm:text-sm">{commentInfo?.subComments?.length} Phản hồi</span>
                        </Button>
                    ) : null}

                    {showWriteResponse && (
                        <div className="flex items-end gap-2">
                            <Textarea
                                variant="bordered"
                                color="primary"
                                labelPlacement="outside"
                                placeholder="Viết phản hồi của bạn"
                                className="mt-2"
                                onChange={event => setResponseComment(event?.target?.value)}
                            />
                            <Button
                                className="ml-[-54px] !min-w-[40px] w-[40px] h-[40px] rounded-full mb-2 cursor-pointer"
                                isLoading={isSubmitting}
                                color="primary"
                                variant="light"
                                size="sm"
                                disabled={responseComment == '' || isSubmitting}
                                onClick={onSubmit}
                            >
                                <IoMdSend size={20} />
                            </Button>
                        </div>
                    )}
                    <ul className="mt-2">
                        {commentInfo?.subComments && showSubComment
                            ? commentInfo?.subComments?.map((subCommentInfo: any, index: number) => (
                                  <SubCommentItem key={index} subCommentInfo={subCommentInfo} refetch={refetch} />
                              ))
                            : null}
                    </ul>
                    {/* <SubCommentItem />
                            <SubCommentItem /> */}
                </div>
            </div>
        </li>
    );
};

export default CommentItem;
