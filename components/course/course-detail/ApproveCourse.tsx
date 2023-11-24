'use client';

import { Button, Chip } from '@nextui-org/react';
import Image from 'next/image';
import { SiLevelsdotfyi, SiStatuspage } from 'react-icons/si';
import { TfiVideoClapper } from 'react-icons/tfi';
import { FaBookReader } from 'react-icons/fa';
import { courseStatusColorMap } from '@/utils';
import { useCustomModal, useInputModal } from '@/hooks';
import { toast } from 'react-toastify';
import { courseApi } from '@/api-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { InputModal } from '@/components/modal/InputModal';

interface ApproveCourseProps {
    approveCourse: {
        id: number;
        thumbnail: string;
        price: number;
        subject: string;
        level: string;
        totalVideo: number;
        status: string;
    };
}

const ApproveCourse: React.FC<ApproveCourseProps> = ({ approveCourse }) => {
    let status = '';
    if (approveCourse.status === 'AVAILABLE') status = 'Hoạt động';
    else if (approveCourse.status === 'WAITING') status = 'Chờ xác thực';
    else if (approveCourse.status === 'REJECT') status = 'Đã từ chối';
    else if (approveCourse.status === 'BANNED') status = 'Đã Xóa';
    else if (approveCourse.status === 'UPDATING') status = 'Chờ cập nhật';
    else if (approveCourse.status === 'DRAFT') status = 'Bản nháp';
    else status = 'Vô hiệu';
    const router = useRouter();
    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    const { onOpen: onInputOpen, onClose: onInputClose, onDescription, description } = useInputModal();
    const [declineId, setDeclineId] = useState<number>();
    const handleStatusChange = async (id: number, verifyStatus: string) => {
        let toastLoading;
        console.log({ description, id, verifyStatus });
        try {
            onClose();
            onInputClose();
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            const res = await courseApi.changeCourseStatus({
                id,
                reason: description,
                verifyStatus
            });

            if (!res.data.code) {
                if (verifyStatus == 'ACCEPTED') {
                    toast.success('Khóa học đã được duyệt thành công');
                    router.push('/admin/approve/course');
                } else if (verifyStatus == 'REJECT') {
                    toast.success('Đã từ chối khóa học thành công');
                    router.push('/admin/approve/course');
                }
                toast.dismiss(toastLoading);
            }
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error changing user status', error);
        }
    };

    const onApproveOpen = (id: number) => {
        onWarning({
            title: 'Xác nhận duyệt',
            content: 'Khóa học sẽ được hiện thị sau khi được duyệt. Bạn chắc chứ?',
            activeFn: () => handleStatusChange(id, 'ACCEPTED')
        });
        onOpen();
    };

    const onDeclineOpen = (id: number) => {
        onDanger({
            title: 'Xác nhận từ chối',
            content: 'Khóa học sẽ không được hiển thị sau khi đã từ chối. Bạn chắc chứ?',
            activeFn: () => {
                onClose();
                onInputOpen();
            }
        });
        setDeclineId(id);
        onOpen();
    };

    return (
        <div className="sticky top-[70px] mb-8 md:mb-0">
            <Image
                src={approveCourse?.thumbnail || '/banner/slide-1.png'}
                width={600}
                height={300}
                alt=""
                className="w-full rounded-xl"
            />
            <div className="flex justify-center flex-col items-center">
                <p className="text-center text-2xl text-orange-500 mt-4 font-bold">
                    ₫ {approveCourse?.price.toLocaleString('vi-VN')}{' '}
                </p>
                {(approveCourse?.status === 'WAITING' || approveCourse?.status === 'UPDATING') && (
                    <Button
                        color="primary"
                        className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base hover:text-white"
                        onClick={() => onApproveOpen(approveCourse?.id)}
                    >
                        Phê duyệt
                    </Button>
                )}
                <Button
                    color="danger"
                    className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base hover:text-white"
                    onClick={() => onDeclineOpen(approveCourse?.id)}
                >
                    Từ chối
                </Button>
                <div className="hidden md:block">
                    <div className="flex items-center my-4">
                        <SiLevelsdotfyi className="mr-8" />
                        <span className="text-sm">
                            {approveCourse?.subject} - {approveCourse?.level}
                        </span>
                    </div>

                    <div className="flex items-center my-4">
                        <TfiVideoClapper className="mr-8" />
                        <span className="text-sm">{approveCourse?.totalVideo} bài giảng </span>
                    </div>
                    <div className="flex items-center my-4">
                        <FaBookReader className="mr-8" />
                        <span className="text-sm">5 bài tập</span>
                    </div>
                    <div className="flex items-center my-4">
                        <SiStatuspage className="mr-6" />
                        <Chip
                            className="capitalize border-none gap-1 text-default-600"
                            color={courseStatusColorMap[approveCourse.status]}
                            size="sm"
                            variant="dot"
                        >
                            {status}
                        </Chip>
                    </div>
                </div>
            </div>
            <InputModal activeFn={() => handleStatusChange(declineId as number, 'REJECT')} />
        </div>
    );
};

export default ApproveCourse;
