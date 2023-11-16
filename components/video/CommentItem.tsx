'use client';

import { Avatar, Button, Tooltip } from '@nextui-org/react';
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

interface CommentItemProps {
    commentInfo: CommentCardType;
}

const CommentItem: React.FC<CommentItemProps> = ({ commentInfo }) => {
    const [showSubComment, setShowSubComment] = useState<boolean>(false);
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    const { isOpen, onOpen, onClose, onContentType, onReportType, onDescription, onFile } = useReportModal();

    const openReportModal = () => {
        onContentType('comment');
        onOpen();
    };

    return (
        <li className="flex gap-4 group mb-6">
            <div>
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
            </div>
            <div className="w-full">
                <div className="bg-gray-50 pt-2 pb-4 px-4 rounded-xl">
                    <h4 className="font-semibold text-sm sm:text-base">{commentInfo?.ownerEmail}</h4>
                    <div className="my-2">
                        <Gallery>
                            <Item original="/banner/slide-1.png" width="1024" height="768">
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
                    <p className="text-xs sm:text-sm"> {HTMLReactParser(String(commentInfo?.content))}</p>
                </div>
                <div className="mt-1 flex gap-4 items-center">
                    <span className="flex items-center gap-2">
                        <AiOutlineLike />
                        <span className="text-xs sm:text-sm">7</span>
                    </span>
                    <p className="text-xs sm:text-sm">Phản hồi</p>
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
                <div className="mt-2">
                    <Button variant="light" onClick={() => setShowSubComment(!showSubComment)}>
                        {showSubComment ? <BsChevronUp /> : <BsChevronDown />}
                        <span className="text-xs sm:text-sm">4 Phản hồi</span>
                    </Button>
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
