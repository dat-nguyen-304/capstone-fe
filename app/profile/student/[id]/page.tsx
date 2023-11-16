'use client';

import { Button, Card } from '@nextui-org/react';
import Image from 'next/image';
import { IoIosLogOut } from 'react-icons/io';
import { useUser } from '@/hooks';
import { useRouter } from 'next/navigation';
interface StudentProfileProps {}

const StudentProfile: React.FC<StudentProfileProps> = ({}) => {
    const { user } = useUser();
    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    return (
        <Card className="w-[94%] xl:w-[90%] mx-auto md:grid grid-cols-9 gap-8 my-8 p-8">
            <div className="col-span-4 xl:col-span-3 py-8 px-4 border-1 rounded-xl">
                <div className="w-full max-w-[200px] lg:max-w-[300px] mx-auto relative">
                    <Image src="/student.png" width={300} height={300} alt="" className="sm:border-1 rounded-lg" />
                    <div className="hidden md:block">
                        <h3 className="text-blue-500 text-2xl font-semibold mt-8">Nguyễn Văn An</h3>
                        <p className="mt-4 text-sm">Ngày tham gia: 21/10/2023</p>
                        <p className="mt-4 text-sm">Tổ hợp môn: A00 - B00</p>
                    </div>
                </div>
            </div>
            <div className="col-span-5 xl:col-span-6 mt-8 md:mt-0 relative text-base">
                <h4 className="text-xl text-blue-500 font-semibold mb-8">Thông tin cá nhân</h4>

                <div>
                    <div className="xl:flex items-center mt-4">
                        <p className="w-[160px] font-semibold">Họ và tên</p>
                        <p>Nguyễn Văn An</p>
                    </div>
                    <div className="xl:flex items-center mt-8 xl:mt-4">
                        <p className="w-[160px] font-semibold">Tổ hợp môn</p>
                        <div className="flex gap-4">
                            <p>A00</p>
                            <p>A01</p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <p className="w-[160px] mb-4 xl:mb-0 font-semibold">Giới thiệu</p>
                        <p>Hello my name is abcxyz</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default StudentProfile;
