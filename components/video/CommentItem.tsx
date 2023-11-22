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

interface CommentItemProps {
    commentInfo: CommentCardType | any;
}

const CommentItem: React.FC<CommentItemProps> = ({ commentInfo }) => {
    const [showSubComment, setShowSubComment] = useState<boolean>(false);
    const [showWriteResponse, setShowWriteResponse] = useState<boolean>(false);
    const { isOpen, onOpen, onClose, onContentType, onReportType, onDescription, onFile } = useReportModal();

    const openReportModal = () => {
        onContentType('comment');
        onOpen();
    };

    return (
        <li className="flex gap-4 group mb-6">
            <div>
                <Avatar src={commentInfo?.ownerAvatar || 'https://i.pravatar.cc/150?u=a04258114e29026708c'} />
            </div>
            <div className="w-full">
                <div className="bg-gray-50 pt-2 pb-4 px-4 rounded-xl">
                    <h4 className="font-semibold text-sm sm:text-base">{commentInfo?.ownerFullName}</h4>
                    <div className="my-2">
                        <Gallery>
                            <Item original={commentInfo?.imageUrl || '/banner/slide-1.png'} width="1024" height="768">
                                {({ open }) => (
                                    <Image
                                        onClick={open}
                                        src={commentInfo?.imageUrl || '/banner/slide-1.png'}
                                        width={100}
                                        height={80}
                                        alt=""
                                    />
                                )}
                            </Item>
                        </Gallery>
                    </div>
                    <div className="text-xs sm:text-sm"> {HTMLReactParser(String(commentInfo?.content))}</div>
                </div>
                <div className="mt-1 flex gap-4 items-center">
                    <span className="flex items-center gap-2">
                        <AiOutlineLike />
                        <span className="text-xs sm:text-sm">7</span>
                    </span>
                    <Button variant="light" onClick={() => setShowWriteResponse(!showWriteResponse)}>
                        Phản hồi
                    </Button>
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
                </div>
                <div className="">
                    <Button variant="light" onClick={() => setShowSubComment(!showSubComment)}>
                        {showSubComment ? <BsChevronUp /> : <BsChevronDown />}
                        <span className="text-xs sm:text-sm">4 Phản hồi</span>
                    </Button>
                    {showWriteResponse && (
                        <div className="flex items-end gap-2">
                            <Textarea
                                variant="bordered"
                                color="primary"
                                labelPlacement="outside"
                                placeholder="Viết phản hồi của bạn"
                                className="mt-2"
                            />
                            <Button className="ml-[-78px] mb-2" color="primary" variant="light" size="sm">
                                <IoMdSend size={20} />
                            </Button>
                        </div>
                    )}
                    {showSubComment && (
                        <ul className="mt-2">
                            <SubCommentItem />
                            <SubCommentItem />
                        </ul>
                    )}
                </div>
            </div>
        </li>
    );
};

export default CommentItem;
