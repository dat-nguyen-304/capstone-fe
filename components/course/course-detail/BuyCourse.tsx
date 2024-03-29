'use client';

import Image from 'next/image';
import { SiLevelsdotfyi } from 'react-icons/si';
import { TfiVideoClapper } from 'react-icons/tfi';
import { FaBookReader } from 'react-icons/fa';
import { BsPersonWorkspace } from 'react-icons/bs';
import { useUser } from '@/hooks';
import { redirect } from 'next/navigation';
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    SelectItem,
    Select,
    Checkbox
} from '@nextui-org/react';
import { transactionApi } from '@/api-client';
import { Transaction } from '@/types';
import { useState } from 'react';
import BuyCourseRuleModal from '@/components/rule/BuyCourseRuleModal';
import { toast } from 'react-toastify';
interface BuyCourseProps {
    buyCourse: any;
}

const BuyCourse: React.FC<BuyCourseProps> = ({ buyCourse }) => {
    const { user } = useUser();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isCheckedPolicy, setIsCheckPolicy] = useState(false);
    const [openBuyCourseRule, setOpenBuyCourseRule] = useState(false);
    const [bankCode, setBankCode] = useState<string>('ncb');
    const handleConfirmButtonClick = async () => {
        // Assuming you have the necessary data for the payload
        if (!isCheckedPolicy) toast.error('Bạn cần đồng ý với điều khoản và chính sách của CEPA');
        else {
            const paymentPayload: Transaction = {
                courseId: buyCourse?.id,
                bankCode: bankCode,
                language: 'vn'
            };

            try {
                const res = await transactionApi.createPayment(paymentPayload);
                window.location.href = res?.data;
                // window.open(res?.data, '_blank');
                // window.open(res?.data);
                onOpenChange();
            } catch (error) {
                // Handle errors here, e.g., show an error message
                console.error('Error creating payment:', error);
            }
        }
    };

    return (
        <div className="sticky top-[70px] mb-8 md:mb-0">
            <Image
                src={buyCourse?.thumbnail || '/banner/slide-1.png'}
                width={600}
                height={300}
                alt=""
                className="w-full rounded-xl h-[200px] max-w-[400px] mx-auto object-cover object-center"
            />
            <div className="flex justify-center flex-col items-center">
                <p className="text-center text-2xl text-orange-500 mt-4 font-bold">
                    ₫ {buyCourse?.price?.toLocaleString('vi-VN')}
                </p>
                {user?.role === 'STUDENT' && !buyCourse?.isAccess ? (
                    <Button color="primary" onPress={onOpen} className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base">
                        Mua ngay
                    </Button>
                ) : null}
                <div className="hidden md:block">
                    <div className="flex items-center my-4">
                        <SiLevelsdotfyi className="mr-8" />
                        <span className="text-sm">
                            {buyCourse?.subject} - {buyCourse?.level}
                        </span>
                    </div>
                    <div className="flex items-center my-4">
                        <TfiVideoClapper className="mr-8" />
                        <span className="text-sm">{buyCourse?.totalVideo || 0} bài giảng </span>
                    </div>
                    <div className="flex items-center my-4">
                        <FaBookReader className="mr-8" />
                        <span className="text-sm">{buyCourse?.totalQuiz || 0} bài tập</span>
                    </div>
                    <div className="flex items-center my-4">
                        <BsPersonWorkspace className="mr-8" />
                        <span className="text-sm">Học mọi lúc mọi nơi</span>
                    </div>
                </div>
            </div>
            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Phương thức thanh toán</ModalHeader>
                            <ModalBody>
                                <Select
                                    isRequired
                                    label="Ngân hàng"
                                    defaultSelectedKeys={['ncb']}
                                    className="w-full"
                                    onChange={event => setBankCode(event?.target?.value)}
                                >
                                    <SelectItem key="ncb" value="ncb">
                                        Ngân hàng quốc dân (NCB)
                                    </SelectItem>
                                    <SelectItem key="us" value="us">
                                        Ngân hàng đầu tư và phát triển nông thân (Agribank)
                                    </SelectItem>
                                </Select>
                                <Select isRequired label="Quốc gia" defaultSelectedKeys={['vn']} className="w-full">
                                    <SelectItem key="vn" value="vn">
                                        VietNam (VN)
                                    </SelectItem>
                                    <SelectItem key="us" value="us">
                                        United States (US)
                                    </SelectItem>
                                </Select>
                                <div className="flex items-start ">
                                    <div className="flex items-center h-5">
                                        <Checkbox isSelected={isCheckedPolicy} onValueChange={setIsCheckPolicy} />
                                    </div>
                                    <label
                                        htmlFor="remember"
                                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        Tôi đồng ý với{' '}
                                        <a
                                            className="text-blue-600 hover:underline dark:text-blue-500 cursor-pointer"
                                            onClick={() => setOpenBuyCourseRule(true)}
                                        >
                                            chính sách và điều khoản của CEPA
                                        </a>
                                        .
                                    </label>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Hủy bỏ
                                </Button>
                                <Button color="primary" onPress={handleConfirmButtonClick}>
                                    Xác nhận
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
                <BuyCourseRuleModal
                    isOpen={openBuyCourseRule}
                    onOpen={() => setOpenBuyCourseRule(true)}
                    onClose={() => setOpenBuyCourseRule(false)}
                />
            </Modal>
        </div>
    );
};

export default BuyCourse;
