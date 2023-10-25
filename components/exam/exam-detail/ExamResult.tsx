'use client';

import { User } from '@nextui-org/react';
import Link from 'next/link';

interface ExamResultItemProps {}

const ExamResultItem: React.FC<ExamResultItemProps> = ({}) => {
    return (
        <li className="flex items-center justify-between border-t-1 border-gray-300 p-4 my-2">
            <User
                name="Làm bài lần 1"
                description="Nộp bài lúc 30/12/2023 13:33:33"
                avatarProps={{
                    src: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                }}
                className="hidden md:flex"
            />
            <h3 className="md:hidden text-xs sm:text-sm">Làm bài lần 1</h3>
            <div className="text-xs sm:text-sm">
                Điểm số <span className="font-bold mr-4">5</span>
                <Link className="text-xs sm:text-sm underline text-blue-500" href="/test-result/1">
                    Xem chi tiết
                </Link>
            </div>
        </li>
    );
};

export default ExamResultItem;
