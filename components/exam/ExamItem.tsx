'use client';

import { Button, Card } from '@nextui-org/react';
import { BsBookFill, BsClockFill } from 'react-icons/bs';
import { FaUserEdit } from 'react-icons/fa';
import { GoCommentDiscussion } from 'react-icons/go';
import { useCustomModal, useUser } from '@/hooks';
import { useRouter } from 'next/navigation';
import { ExamCardType } from '@/types';
import { MdVerified } from 'react-icons/md';

interface ExamItemProps {
    exam: ExamCardType | any;
}

function getSubjectName(subjectCode: string) {
    switch (subjectCode) {
        case 'MATHEMATICS':
            return 'Toán học';
        case 'ENGLISH':
            return 'Tiếng anh';
        case 'PHYSICS':
            return 'Vật lí';
        case 'CHEMISTRY':
            return 'Hóa học';
        case 'BIOLOGY':
            return 'Sinh học';
        case 'HISTORY':
            return 'Lịch sử';
        case 'GEOGRAPHY':
            return 'Địa lý';
        default:
            return null;
    }
}

const ExamItem: React.FC<ExamItemProps> = ({ exam }) => {
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

    console.log({ exam });

    return (
        <li>
            <Card className="relative border-1 border-gray-200 rounded-xl p-2 sm:p-4 shadow-lg">
                <div className="flex font-semibold text-sm sm:text-base truncate2line sm:h-[50px] h-[42px]">
                    {exam?.attempted && <MdVerified color="rgb(13, 226, 152)" className="inline mr-1 mb-1" size={20} />}
                    <span>{exam?.name}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                    <BsBookFill className="text-blue-700" />
                    <span className="text-xs sm:text-sm">{getSubjectName(exam?.subject)}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                    <BsClockFill className="text-blue-700" />
                    <span className="text-xs sm:text-sm">{exam?.duration} phút</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                    <FaUserEdit className="text-blue-700" />
                    <span className="text-xs sm:text-sm">{exam?.attemptCount} lượt làm</span>
                </div>
                <Button variant="bordered" className="mt-2" onClick={() => handleDoExam(exam?.id)}>
                    {exam?.attempted ? 'Làm lại' : 'Làm ngay'}
                </Button>
            </Card>
        </li>
    );
};

export default ExamItem;
