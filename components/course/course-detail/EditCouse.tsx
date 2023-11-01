'use client';

import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { SiLevelsdotfyi } from 'react-icons/si';
import { TfiVideoClapper } from 'react-icons/tfi';
import { FaBookReader } from 'react-icons/fa';
import { BsPersonWorkspace } from 'react-icons/bs';
import Link from 'next/link';

interface EditCourseProps {}

const EditCourse: React.FC<EditCourseProps> = ({}) => {
    return (
        <div className="sticky top-[70px] mb-8 md:mb-0">
            <Image src="/banner/slide-1.png" width={600} height={300} alt="" className="w-full" />
            <div className="flex justify-center flex-col items-center">
                <p className="text-center text-2xl text-orange-500 mt-4 font-bold">₫ 400.000</p>
                <Button color="warning" className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base">
                    <Link href="/teacher/course/edit/1" className="w-full block ">
                        <span className="text-black">Chỉnh sửa</span>
                    </Link>
                </Button>

                <div className="hidden md:block">
                    <div className="flex items-center my-4">
                        <SiLevelsdotfyi className="mr-8" />
                        <span className="text-sm">Toán học - Cơ bản</span>
                    </div>
                    <div className="flex items-center my-4">
                        <TfiVideoClapper className="mr-8" />
                        <span className="text-sm">20 bài giảng </span>
                    </div>
                    <div className="flex items-center my-4">
                        <FaBookReader className="mr-8" />
                        <span className="text-sm">5 bài tập</span>
                    </div>
                    <div className="flex items-center my-4">
                        <BsPersonWorkspace className="mr-8" />
                        <span className="text-sm">Học mọi lúc mọi nơi</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCourse;
