'use client';

import { BsArrowLeft } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@nextui-org/react';

interface HeaderVideoProps {}

const HeaderVideo: React.FC<HeaderVideoProps> = ({}) => {
    return (
        <div className="h-[60px] bg-blue-400 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                <Link href="/courses/1">
                    <Button className="text-sm" size="sm">
                        <BsArrowLeft />
                    </Button>
                </Link>
                <Image
                    src="https://intaadvising.gatech.edu/wp-content/uploads/2020/11/cepa.png"
                    width={60}
                    height={60}
                    alt=""
                />
                <p className="text-white">Khóa học lấy gốc thần tốc</p>
            </div>
            <div className="flex justify-center items-center text-white">
                <span className="inline-flex items-center text-xs">
                    <span className="font-bold mr-1">20</span>
                    <span>Bài giảng</span>
                    <Image src="/video-number/blue.svg" width={30} height={30} alt="" />
                </span>
                <span className="before:content-['•'] before:inline-block before:text-white before:mx-2">
                    <span className="inline-flex items-center text-xs">
                        <span className="font-bold mr-1">5</span>
                        <span>Bài tập</span>
                        <Image src="/video-number/red.svg" width={30} height={30} alt="" />
                    </span>
                </span>
                <span className="before:content-['•'] before:inline-block before:text-white before:mx-2">
                    <span className="inline-flex items-center text-xs">
                        <span className="mr-1">Đã học</span>
                        <span className="font-bold">(5/10)</span>
                        <Image src="/video-number/green.svg" width={30} height={30} alt="" />
                    </span>
                </span>
                <Button className="ml-8" color="danger" variant="solid">
                    Báo lỗi
                </Button>
            </div>
        </div>
    );
};

export default HeaderVideo;
