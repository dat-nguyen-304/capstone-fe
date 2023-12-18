'use client';

import { Avatar } from '@nextui-org/react';
import { Rate } from 'antd';

interface FeedbackItemProps {
    feedbackInfo: any;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedbackInfo }) => {
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    const dateValue = feedbackInfo?.upDateTime ? new Date(feedbackInfo?.upDateTime) : new Date();

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })?.format(dateValue);
    return (
        <li className="md:p-4 border-b border-slate-200 pb-[20px]">
            <div className="flex items-center justify-between">
                <div className="p-2 flex">
                    <Avatar
                        src={feedbackInfo?.avatar || 'https://i.pravatar.cc/150?u=a04258114e29026708c'}
                        className="w-12 h-12"
                    />
                    <div className="ml-4">
                        <p className="text-sm font-semibold">
                            {feedbackInfo?.fullname ? feedbackInfo?.fullname : 'Nguyễn Văn A'}
                        </p>
                        <Rate
                            className="!text-xs sm:text-base"
                            disabled
                            value={feedbackInfo?.rate ? feedbackInfo?.rate : 5}
                        />
                    </div>
                </div>
                <p className="font-light text-sm">{formattedDate || '22/10/2023'}</p>
            </div>
            <div className="p-2 text-sm text-justify">
                {feedbackInfo?.content ? feedbackInfo?.content : defaultContent}
            </div>
        </li>
    );
};

export default FeedbackItem;
