'use client';

import NotFound from '@/app/not-found';
import { useUser } from '@/hooks';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';

interface DoTestHeaderProps {
    type: 'quiz' | 'exam';
    id: number;
}

const DoTestHeader: React.FC<DoTestHeaderProps> = ({ type, id }) => {
    const { user } = useUser();

    if (user?.role !== 'STUDENT') return <NotFound />;

    return (
        <div className="h-[60px] z-10 fixed left-0 right-0 top-0 bg-blue-400 flex items-center justify-between px-2 sm:px-8 text-white">
            <div className="flex items-center gap-4">
                <Image
                    src="https://intaadvising.gatech.edu/wp-content/uploads/2020/11/cepa.png"
                    width={60}
                    height={60}
                    alt=""
                    className="hidden sm:block"
                />
                <span className="text-sm max-w-[120px] sm:max-w-[300px] xl:max-w-[600px] truncate">
                    Bài kiểm tra abcxyz Bài kiểm tra abcxyz Bài kiểm tra abcxyz Bài kiểm tra abcxyz
                </span>
            </div>
            <div className="">
                <Button size="sm" className="mr-4" color="danger" variant="solid">
                    Báo lỗi
                </Button>
                <Button as={Link} href={type === 'quiz' ? `/quiz/${id}` : `/exam/${id}`} size="sm">
                    Thoát
                </Button>
            </div>
        </div>
    );
};

export default DoTestHeader;
