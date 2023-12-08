'use client';

import RevenueChart from '@/components/chart/teacher-dashboard/RevenueChart';
import RevenueChartCourseDetail from '@/components/chart/teacher-dashboard/RevenueChartCourseDetail';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { Progress } from 'antd';
import { useState } from 'react';

interface BuyCourseRuleProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const BuyCourseRuleModal: React.FC<BuyCourseRuleProps> = ({ isOpen, onOpen, onClose }) => {
    return (
        <Modal size="3xl" isOpen={isOpen} onClose={onClose} scrollBehavior={'inside'} className="!sm:mt-6 sm:mb-4">
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Chính sách và điều khoản</ModalHeader>
                        <ModalBody>
                            <h3 className="font-bold">1. Điều khoản sử dụng</h3>
                            <h4 className="font-semibold">1.1 Quy tắc chung:</h4>
                            <p className="text-sm">
                                1.1.1. Bằng cách mua bất kỳ khóa học nào trên nền tảng của chúng tôi, bạn đồng ý và tuân
                                thủ theo các điều khoản và điều kiện dưới đây.
                            </p>

                            <h3 className="font-bold">2. Thanh toán, Hóa đơn và Hoàn tiền:</h3>
                            <h4 className="font-semibold">2.1. Thanh toán:</h4>
                            <p className="text-sm">
                                2.1.1. Bạn đồng ý thanh toán đầy đủ số tiền mua khóa học theo các phương thức thanh toán
                                mà chúng tôi chấp nhận.
                            </p>
                            <h4 className="font-semibold">2.2. Hóa đơn:</h4>
                            <p className="text-sm">
                                2.2.1. Hóa đơn mua hàng sẽ được cung cấp và có thể được tìm thấy trong lịch sử giao dịch
                                từ tài khoản của bạn.
                            </p>

                            <h3 className="font-bold">3. Quyền lợi và Trách nhiệm:</h3>
                            <h4 className="font-semibold">3.1. Truy cập:</h4>
                            <p className="text-sm">
                                3.1.1. Bạn có quyền truy cập vào tất cả nội dung và tài nguyên của khóa học mà bạn đã
                                mua trong khoảng thời gian có hiệu lực.
                            </p>
                            <h4 className="font-semibold">3.2. Chất lượng nội dung:</h4>
                            <p className="text-sm">
                                3.2.1. Chúng tôi cam kết cung cấp nội dung chất lượng và giảng dạy có giá trị.
                            </p>
                            <h3 className="font-bold">4. Hoàn tiền</h3>
                            <h4 className="font-semibold">4.1 Chính sách hoàn tiền:</h4>
                            <p className="text-sm">
                                4.1.1. Khóa học chỉ được hoàn tiền trong 3 ngày kể từ khi thanh toán thành công khóa học
                            </p>
                            <h3 className="font-bold">5. Bảo mật và Quyền riêng tư:</h3>
                            <h4 className="font-semibold">5.1. Bảo mật thông tin:</h4>
                            <p className="text-sm">
                                5.1.1. Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và không chia sẻ nó với bất kỳ
                                bên thứ ba nào mà không có sự đồng ý của bạn.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Đóng
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default BuyCourseRuleModal;
