'use client';

import Image from 'next/image';
import { BiSolidPencil } from 'react-icons/bi';
import { UploadImageModal } from '../modal/UploadImageModal';
import { Chip, useDisclosure } from '@nextui-org/react';
import Loader from '../Loader';

interface StudentAvatarProps {
    studentData: any;
}

const StudentAvatar: React.FC<StudentAvatarProps> = ({ studentData }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    if (!studentData) return <Loader />;

    return (
        <>
            <h4 className="md:hidden text-lg sm:text-xl text-blue-500 font-semibold mb-8">Ảnh đại diện</h4>
            <div className="rounded-xl">
                <div className="w-[200px] lg:w-[300px] h-[200px] lg:h-[300px] mx-auto relative object-contain">
                    <div className="group relative object-contain ">
                        <Image
                            src={studentData.url || '/student.png'}
                            width={300}
                            height={300}
                            alt=""
                            className="border-1 rounded-lg w-[200px] lg:w-[300px] h-[200px] lg:h-[300px] object-cover"
                        />
                    </div>

                    <div
                        onClick={onOpen}
                        className="absolute right-2 top-2 shadow-lg rounded-full border-2 border-blue-700 bg-blue-300 cursor-pointer w-[40px] h-[40px] flex items-center justify-center"
                    >
                        <BiSolidPencil size={20} className="text-blue-500" />
                    </div>
                    <UploadImageModal
                        image={studentData.image || '/student.png'}
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onOpenChange={onOpenChange}
                    />

                    <div className="hidden md:block">
                        <h3 className="text-blue-500 text-2xl font-semibold mt-8">{studentData.fullName}</h3>
                        <p className="mt-4 text-sm">Ngày tham gia: 21/10/2023</p>
                        <p className="mt-4 text-sm">
                            Tổ hợp môn:
                            <ul className="flex flex-wrap gap-2 mt-2">
                                {studentData.targets.map((target: any) => (
                                    <li key={target.name}>
                                        <Chip color="primary" className=" text-xs sm:text-sm">
                                            {target.name}
                                        </Chip>
                                    </li>
                                ))}
                            </ul>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentAvatar;
