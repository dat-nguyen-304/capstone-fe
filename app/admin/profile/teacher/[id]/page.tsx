'use client';

import { teacherApi, userApi } from '@/api-client';
import Loader from '@/components/Loader';
import { InputModal } from '@/components/modal/InputModal';
import CourseTab from '@/components/profile/CourseTab';
import VideoTab from '@/components/profile/VideoTab';
import { useCustomModal, useInputModal, useSelectedSidebar } from '@/hooks';
import { Button, Card, Chip, Tab, Tabs } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import HTMLReactParser from 'html-react-parser';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import { toast } from 'react-toastify';

interface TeacherProfileProps {
    params: { id: string };
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ params }) => {
    const router = useRouter();
    const [declineId, setDeclineId] = useState<number>();
    const { data } = useQuery({
        queryKey: ['teacher-public-detail', { params: params?.id }],
        queryFn: () => teacherApi.getPublicTeacher(params.id)
    });

    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    const { onOpen: onInputOpen, onClose: onInputClose, onDescription, description } = useInputModal();

    const handleBanUser = async (id: number) => {
        let toastLoading;

        try {
            onClose();
            onInputClose();
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            const res = await userApi.banUser({
                accountId: id,
                reason: description
            });
            if (!res?.data?.code) {
                toast.success('Tài khoản đã được cấm thành công');
                router.push('/admin/teacher');
            }
            toast.dismiss(toastLoading);
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error changing user status', error);
        }
    };
    const onDeclineOpen = (id: number) => {
        onDanger({
            title: 'Xác nhận cấm tài khoản',
            content: 'Tài khoản sẽ bị cấm và người dùng không thể đăng nhập sau khi bạn xác nhận. Bạn chắc chứ?',
            activeFn: () => {
                onClose();
                onInputOpen();
            }
        });
        setDeclineId(id);
        onOpen();
    };

    if (!data) return <Loader />;

    const teacherData = data.data;
    const dateValue = teacherData?.createDate ? new Date(teacherData?.createDate) : new Date();

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })?.format(dateValue);
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto ">
            <div className="flex items-center justify-between">
                <Button
                    variant="light"
                    className="mt-4 inline-flex items-center gap-2 text-sm cursor-pointer"
                    onClick={() => router.back()}
                >
                    <BsArrowLeft />
                    <span>Quay lại</span>
                </Button>
                <div className="flex gap-2">
                    <div className="flex gap-2">
                        <Button color="danger" variant="flat" size="sm" onClick={() => onDeclineOpen(teacherData?.id)}>
                            Cấm
                        </Button>
                    </div>
                </div>
            </div>

            <Card className="p-8 my-4 min-h-[360px]">
                <div className=" md:flex items-start gap-8">
                    <div className="col-span-4 xl:col-span-3 rounded-xl">
                        <Image
                            src={teacherData.url || '/student.png'}
                            width={100}
                            height={100}
                            alt=""
                            className="border-1 rounded-full"
                        />
                    </div>
                    <div className="col-span-5 xl:col-span-6 mt-8 sm:mt-0 relative">
                        <h3 className="text-base text-blue-500 sm:text-2xl font-semibold flex items-center gap-2">
                            {teacherData.fullName}
                            {/* <MdVerified color="#0de298" /> */}
                        </h3>
                        <div>
                            <div className="xl:flex items-center mt-4 gap-4">
                                <p className="text-sm text-[#444] sm:text-base">Giáo viên môn</p>
                                <div className="flex gap-2 mt-2 xl:mt-0">
                                    {teacherData.subject.map((s: string) => (
                                        <Chip key={s} color="primary" variant="flat">
                                            {s}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                            <div className="xl:flex items-center mt-4">
                                <p className="text-sm text-[#444] sm:text-base">
                                    <span className="mr-2">Ngày tham gia:</span>
                                    {formattedDate}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Tabs color="primary" variant="underlined" aria-label="Tabs variants" className="mt-4">
                        <Tab key="description" title="Lời giới thiệu" className="p-0">
                            <div className="mt-4">{HTMLReactParser(teacherData.description)}</div>
                        </Tab>
                        <Tab key="course" title="Khóa học">
                            <CourseTab teacher={params.id} />
                        </Tab>
                        <Tab key="video" title="Video">
                            <VideoTab type="admin" teacher={params.id} />
                        </Tab>
                    </Tabs>
                </div>
            </Card>
            <InputModal activeFn={() => handleBanUser(declineId as number)} />
        </div>
    );
};

export default TeacherProfile;
