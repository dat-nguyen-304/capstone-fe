'use client';

import { studentApi, userApi } from '@/api-client';
import Loader from '@/components/Loader';
import { InputModal } from '@/components/modal/InputModal';
import { useCustomModal, useInputModal } from '@/hooks';
import { Button, Card, Chip } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { toast } from 'react-toastify';

interface StudentProfileProps {
    params: { id: string };
}

const StudentProfile: React.FC<StudentProfileProps> = ({ params }) => {
    const router = useRouter();
    const [declineId, setDeclineId] = useState<number>();
    const { data } = useQuery({
        queryKey: ['student-public-detail', { params: params?.id }],
        queryFn: () => studentApi.getPublicStudent(params.id)
    });

    const targets = data?.data.targets;
    const studentData = data?.data.userResponse;
    const dateValue = studentData?.createDate ? new Date(studentData?.createDate) : new Date();

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })?.format(dateValue);

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
                router.push('/admin/student');
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
    if (!studentData) return <Loader />;
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
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
                    <Button color="danger" variant="flat" size="sm" onClick={() => onDeclineOpen(studentData?.id)}>
                        Cấm
                    </Button>
                </div>
            </div>
            <Card className="md:grid grid-cols-9 gap-8 my-4 p-8">
                <div className="col-span-4 xl:col-span-3 py-8 px-4 border-1 rounded-xl">
                    <div className="w-full max-w-[200px] lg:max-w-[300px] mx-auto relative">
                        <Image
                            src={studentData?.url ? studentData?.url : '/student.png'}
                            width={300}
                            height={300}
                            alt=""
                            className="sm:border-1 rounded-lg"
                        />
                        <div className="hidden md:block">
                            <h3 className="text-blue-500 text-2xl font-semibold mt-8">{studentData.fullName}</h3>
                            {/* <p className="mt-4 text-sm">Ngày tham gia: 21/10/2023</p>
                        <p className="mt-4 text-sm">Tổ hợp môn: A00 - B00</p> */}
                        </div>
                    </div>
                </div>
                <div className="col-span-5 xl:col-span-6 mt-8 md:mt-0 relative text-base">
                    <h4 className="text-xl text-blue-500 font-semibold mb-8">Thông tin cá nhân</h4>
                    <div>
                        <div className="xl:flex items-center mt-4">
                            <p className="w-[160px] font-semibold">Họ và tên</p>
                            <p>{studentData.fullName}</p>
                        </div>
                        <div className="xl:flex items-center mt-4">
                            <p className="w-[160px] font-semibold">Ngày tham gia</p>
                            <p>{formattedDate || '12/12/2023'}</p>
                        </div>
                        <div className="xl:flex items-center mt-4">
                            <p className="w-[160px] font-semibold">Tổ hợp môn</p>
                            <ul>
                                {targets.map((target: any) => (
                                    <li className="inline-block mx-1" key={target.id}>
                                        <Chip color="primary" size="sm" variant="flat">
                                            {target.name}
                                        </Chip>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Card>
            <InputModal activeFn={() => handleBanUser(declineId as number)} />
        </div>
    );
};

export default StudentProfile;
