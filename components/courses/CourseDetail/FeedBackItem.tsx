'use client';

import { Avatar } from '@nextui-org/react';
import { Rate } from 'antd';

interface FeedbackItemProps {}

const FeedbackItem: React.FC<FeedbackItemProps> = ({}) => {
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    return (
        <li className="md:p-4 border-b border-slate-200 pb-[20px]">
            <div className="flex items-center justify-between">
                <div className="p-2 flex">
                    <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" className="w-12 h-12" />
                    <div className="ml-4">
                        <p className="text-sm font-semibold">Nguyễn Văn A</p>
                        <Rate className="!text-xs sm:text-base" disabled defaultValue={5} />
                    </div>
                </div>
                <p className="font-light text-sm">22/10/2023</p>
            </div>
            <div className="p-2 text-sm text-justify">{defaultContent}</div>
        </li>
    );
};

export default FeedbackItem;
