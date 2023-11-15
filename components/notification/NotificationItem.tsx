'use client';

import Image from 'next/image';
import { BsCashCoin } from 'react-icons/bs';
import { GoCommentDiscussion } from 'react-icons/go';

interface NotificationItemProps {
    type: 'transaction' | 'system' | 'comment';
    content: string;
    time: string;
    money?: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ type, content, time, money }) => {
    let icon;
    if (type === 'comment') icon = <GoCommentDiscussion className="mr-2" size={24} />;
    else if (type === 'transaction') icon = <BsCashCoin className="mr-2 text-blue-500" size={24} />;
    else
        icon = (
            <Image
                src="https://intaadvising.gatech.edu/wp-content/uploads/2020/11/cepa.png"
                alt=""
                width={30}
                height={30}
                className="mr-2 text-yellow-600 "
            />
        );
    return (
        <li className="flex rounded-xl border-2 p-2 sm:p-4 items-center my-2">
            <div className="w-[50px]">{icon}</div>
            <div className="flex-[1] text-xs sm:text-sm">
                <p>{content}</p>
                {money && (
                    <p className={`${money >= 0 ? 'text-green-500' : 'text-red-500'} `}>
                        {money > 0 && '+'}
                        {money}
                    </p>
                )}
            </div>
            <p className="text-xs sm:text-sm ml-1">{time}</p>
        </li>
    );
};

export default NotificationItem;
