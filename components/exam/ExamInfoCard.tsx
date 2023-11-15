'use client';

import { Button, Card } from '@nextui-org/react';
import Image from 'next/image';
import { CiPaperplane } from 'react-icons/ci';
import { PiTarget } from 'react-icons/pi';
import { SiGoogleanalytics } from 'react-icons/si';
import { useUser } from '@/hooks';
import Link from 'next/link';

interface ExamInfoCardProps {}

const ExamInfoCard: React.FC<ExamInfoCardProps> = ({}) => {
    const currentUser = useUser();

    return (
        <Card className="sticky top-[70px] right-0">
            {currentUser.user ? (
                <div className="py-4 px-6">
                    <div className="flex flex-col items-center mb-2">
                        <Image src="/student.png" alt="" width={60} height={60} className="mb-2" />
                        <span>Nguyen Van An</span>
                    </div>

                    <div className="w-full">
                        <div className="border-t-1 border-t-gray-500 mb-2">
                            <h4 className="font-semibold text-[15px] mt-2">Toán học</h4>
                            <p className="text-[13px] flex items-center gap-2">
                                <CiPaperplane />
                                Điểm hiện tại:<span className="font-bold">3</span>
                            </p>
                            <p className="text-[13px] flex items-center gap-2">
                                <PiTarget />
                                Điểm mục tiêu: <span className="font-bold">10</span>
                            </p>
                        </div>
                        <div className="border-t-1 border-t-gray-500 mb-2">
                            <h4 className="font-semibold text-[15px] mt-2">Toán học</h4>
                            <p className="text-[13px] flex items-center gap-2">
                                <CiPaperplane />
                                Điểm hiện tại:<span className="font-bold">3</span>
                            </p>
                            <p className="text-[13px] flex items-center gap-2">
                                <PiTarget />
                                Điểm mục tiêu: <span className="font-bold">10</span>
                            </p>
                        </div>
                        <div className="border-t-1 border-t-gray-500 mb-2">
                            <h4 className="font-semibold text-[15px] mt-2">Toán học</h4>
                            <p className="text-[13px] flex items-center gap-2">
                                <CiPaperplane />
                                Điểm hiện tại:<span className="font-bold">3</span>
                            </p>
                            <p className="text-[13px] flex items-center gap-2">
                                <PiTarget />
                                Điểm mục tiêu: <span className="font-bold">10</span>
                            </p>
                        </div>
                    </div>
                    <Button className="mt-4 w-full flex items-center" variant="bordered" color="primary">
                        <SiGoogleanalytics />
                        <span> Xem thống kê</span>
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center w-full h-[400px] p-4">
                    <Image src="/need-login.png" alt="" width={200} height={200} className="mb-2" />
                    <p className="text-sm my-8">Đăng nhập ngay để làm bài thi nào</p>
                    <Button as={Link} href="/auth" color="primary">
                        Đăng nhập ngay
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default ExamInfoCard;
