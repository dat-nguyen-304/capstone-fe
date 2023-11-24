'use client';

import { Button, Chip } from '@nextui-org/react';
import Image from 'next/image';
import { SiGoogleanalytics, SiLevelsdotfyi, SiStatuspage } from 'react-icons/si';
import { TfiVideoClapper } from 'react-icons/tfi';
import { FaBookReader } from 'react-icons/fa';
import Link from 'next/link';
import { BiSolidPencil } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import { courseStatusColorMap } from '@/utils';
import { courseApi } from '@/api-client';

interface EditCourseProps {
    onOpen: () => void;
    editCourse: {
        id: number;
        thumbnail: string;
        price: number;
        subject: string;
        level: string;
        totalVideo: number;
        status: string;
    };
}

const EditCourse: React.FC<EditCourseProps> = ({ onOpen, editCourse }) => {
    let status = '';
    if (editCourse.status === 'AVAILABLE') status = 'Hoạt động';
    else if (editCourse.status === 'WAITING') status = 'Chờ xác thực';
    else if (editCourse.status === 'REJECT') status = 'Đã từ chối';
    else if (editCourse.status === 'BANNED') status = 'Đã Xóa';
    else if (editCourse.status === 'UPDATING') status = 'Chờ cập nhật';
    else if (editCourse.status === 'DRAFT') status = 'Bản nháp';
    else status = 'Vô hiệu';
    const handleVerifyCourse = async () => {
        try {
            const courseId = editCourse.id;

            const response = await courseApi.TeacherSendVerifyCourse([courseId]);

            console.log(response);
        } catch (error) {
            console.error('Error verifying course:', error);
        }
    };
    return (
        <div className="sticky top-[70px] mb-8 md:mb-0">
            <Image
                src={editCourse.thumbnail || '/banner/slide-1.png'}
                width={600}
                height={300}
                alt=""
                className="w-full rounded-xl"
            />
            <div className="flex justify-center flex-col items-center">
                <p className="text-center text-2xl text-orange-500 mt-4 font-bold">
                    ₫ {editCourse.price.toLocaleString('vi-VN')}{' '}
                </p>
                {editCourse.status === 'DRAFT' || editCourse.status === 'UPDATING' ? (
                    <Button
                        color="success"
                        className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base hover:text-white"
                        onClick={handleVerifyCourse}
                    >
                        Duyệt khóa học
                    </Button>
                ) : null}
                <Button
                    as={Link}
                    href={`/teacher/course/edit/${editCourse.id}`}
                    color="warning"
                    className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base hover:text-black"
                >
                    Chỉnh sửa <BiSolidPencil />
                </Button>
                {editCourse.status != 'AVAILABLE' && editCourse.status != 'DRAFT' ? (
                    <Button color="danger" className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base hover:text-black">
                        Xóa khóa học <FaTrash />
                    </Button>
                ) : null}

                {editCourse.status === 'AVAILABLE' ? (
                    <Button
                        color="primary"
                        className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base hover:text-white"
                        onClick={onOpen}
                    >
                        Doanh thu <SiGoogleanalytics />
                    </Button>
                ) : null}

                <div className="hidden md:block">
                    <div className="flex items-center my-4">
                        <SiLevelsdotfyi className="mr-8" />
                        <span className="text-sm">
                            {editCourse.subject} - {editCourse.level}
                        </span>
                    </div>
                    <div className="flex items-center my-4">
                        <TfiVideoClapper className="mr-8" />
                        <span className="text-sm">{editCourse.totalVideo} bài giảng </span>
                    </div>
                    <div className="flex items-center my-4">
                        <FaBookReader className="mr-8" />
                        <span className="text-sm">5 bài tập</span>
                    </div>
                    <div className="flex items-center my-4">
                        <SiStatuspage className="mr-6" />
                        <Chip
                            className="capitalize border-none gap-1 text-default-600"
                            color={courseStatusColorMap[editCourse.status]}
                            size="sm"
                            variant="dot"
                        >
                            {status}
                        </Chip>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCourse;
