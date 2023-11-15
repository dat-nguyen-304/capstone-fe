'use client';

import { Button, Card } from '@nextui-org/react';
import { BsBookFill, BsClockFill } from 'react-icons/bs';
import { FaUserEdit } from 'react-icons/fa';
import { GoCommentDiscussion } from 'react-icons/go';
import { useCustomModal, useUser } from '@/hooks';
import { useRouter } from 'next/navigation';

interface ExamItemProps {}

const ExamItem: React.FC<ExamItemProps> = ({}) => {
    const { user } = useUser();
    const router = useRouter();
    const { onOpen, onClose, onWarning } = useCustomModal();

    const handleDoExam = (id: number) => {
        if (user?.role === 'STUDENT') {
            router.push(`/exam/${id}`);
        } else if (!user?.role) {
            onWarning({
                title: 'Yêu cầu đăng nhập',
                content: 'Bạn cần đăng nhập để làm bài thi',
                activeFn: () => {
                    router.push('/auth');
                    onClose();
                }
            });
            onOpen();
        }
    };

    return (
        <li>
            <Card className="border-1 border-gray-200 rounded-xl p-2 sm:p-4 shadow-lg">
                <h3 className="font-semibold text-sm sm:text-base truncate2line">Đề thi thử môn toán BGD & ĐT </h3>
                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                    <BsBookFill className="text-blue-700" />
                    <span className="text-xs sm:text-sm">Toán học</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                    <BsClockFill className="text-blue-700" />
                    <span className="text-xs sm:text-sm">60 phút</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <FaUserEdit className="text-blue-700" />
                        <span className="text-xs sm:text-sm">1.200</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <GoCommentDiscussion className="text-blue-700" />
                        <span className="text-xs sm:text-sm">900</span>
                    </div>
                </div>
                <Button variant="bordered" className="mt-2" onClick={() => handleDoExam(1)}>
                    Làm ngay
                </Button>
            </Card>
        </li>
    );
};

export default ExamItem;
