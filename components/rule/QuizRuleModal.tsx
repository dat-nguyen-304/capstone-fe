'use client';

import RevenueChart from '@/components/chart/teacher-dashboard/RevenueChart';
import RevenueChartCourseDetail from '@/components/chart/teacher-dashboard/RevenueChartCourseDetail';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { Progress } from 'antd';
import { useState } from 'react';

interface QuizRuleProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const QuizRuleModal: React.FC<QuizRuleProps> = ({ isOpen, onOpen, onClose }) => {
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
                                1.1.1. Bằng cách tạo và quản lý bài tập trên nền tảng của chúng tôi, bạn đồng ý và tuân
                                thủ theo các điều khoản và điều kiện dưới đây.
                            </p>

                            <h3 className="font-bold">2. Trách nhiệm và Chất lượng:</h3>
                            <h4 className="font-semibold">2.1 Chất lượng bài tập:</h4>
                            <p className="text-sm">
                                2.1.1. Bạn cam kết cung cấp bài tập chất lượng và có giá trị cho học viên.
                            </p>
                            <h4 className="font-semibold">2.2. Tuân thủ quy định:</h4>
                            <p className="text-sm">
                                2.2.1. Bạn đồng ý không tạo bài tập vi phạm quy định, đạo đức, hoặc chính sách của chúng
                                tôi.
                            </p>

                            <h3 className="font-bold">3. Bảo mật và Quyền riêng tư:</h3>
                            <h4 className="font-semibold">3.1. Bảo mật thông tin:</h4>
                            <p className="text-sm">
                                3.1.1. Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và không chia sẻ nó với bất kỳ
                                bên thứ ba nào mà không có sự đồng ý của bạn.
                            </p>
                            <h3 className="font-bold">4. Sửa đổi điều khoản:</h3>
                            <h4 className="font-semibold">4.1 Điều khoản:</h4>
                            <p className="text-sm">
                                4.1.1. Chúng tôi có quyền điều chỉnh và sửa đổi các điều khoản này mà không cần thông
                                báo trước. Bạn nên kiểm tra định kỳ để cập nhật với những thay đổi mới.
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

export default QuizRuleModal;
