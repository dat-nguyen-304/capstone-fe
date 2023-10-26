'use client';

import { Avatar, Tooltip } from '@nextui-org/react';
import { AiOutlineLike } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { CiFlag1 } from 'react-icons/ci';

interface SubCommentItemProps {}

const SubCommentItem: React.FC<SubCommentItemProps> = ({}) => {
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    return (
        <li className="flex gap-4 group mb-4">
            <div>
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
            </div>
            <div className="w-full">
                <div className="bg-gray-50 pt-2 pb-4 px-4 rounded-xl">
                    <h4 className="font-semibold">Nguyễn Văn An</h4>
                    <p className="text-sm"> {defaultContent}</p>
                </div>
                <div className="mt-1 flex gap-4 items-center">
                    <span className="flex items-center gap-2">
                        <AiOutlineLike />
                        <span className="text-sm">7</span>
                    </span>
                    <p className="text-sm">Phản hồi</p>
                    <Tooltip
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
            </div>
        </li>
    );
};

export default SubCommentItem;