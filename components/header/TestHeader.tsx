'use client';

import { Button } from '@nextui-org/react';
import Image from 'next/image';

interface HeaderTestProps {}

const HeaderTest: React.FC<HeaderTestProps> = ({}) => {
    return (
        <div className="h-[60px] z-10 fixed left-0 right-0 top-0 bg-blue-400 flex items-center justify-between px-8 text-white">
            <div className="flex items-center gap-4">
                <Image
                    src="https://intaadvising.gatech.edu/wp-content/uploads/2020/11/cepa.png"
                    width={60}
                    height={60}
                    alt=""
                />
                <span className="text-sm">
                    Bài kiểm tra abcxyz Bài kiểm tra abcxyz Bài kiểm tra abcxyz Bài kiểm tra abcxyz
                </span>
            </div>
            <div className="">
                <Button size="sm" className="mr-4" color="danger" variant="solid">
                    Báo lỗi
                </Button>
                <Button size="sm">Thoát</Button>
            </div>
        </div>
    );
};

export default HeaderTest;
