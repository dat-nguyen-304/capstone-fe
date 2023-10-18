'use client';

import { Button } from '@nextui-org/react';
import Image from 'next/image';
interface BuyCourseProps {}

const BuyCourse: React.FC<BuyCourseProps> = ({}) => {
    return (
        <div className="sticky top-[70px]">
            <Image src="/banner/slide-1.png" width={300} height={240} alt="" className="w-full" />
            <div className="flex justify-center flex-col items-center">
                <p className="text-center text-2xl text-orange-500 mt-4 font-bold">₫ 400.000</p>
                <Button color="primary" className="w-[80%] !mt-4 rounded-full text-base">
                    Mua ngay
                </Button>
            </div>
        </div>
    );
};

export default BuyCourse;
