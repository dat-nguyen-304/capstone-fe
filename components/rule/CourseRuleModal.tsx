'use client';

import RevenueChart from '@/components/chart/teacher-dashboard/RevenueChart';
import RevenueChartCourseDetail from '@/components/chart/teacher-dashboard/RevenueChartCourseDetail';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { Progress } from 'antd';
import { useState } from 'react';

interface CourseRuleProps {
    submission?: any;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const CourseRuleModal: React.FC<CourseRuleProps> = ({ isOpen, onOpen, onClose, submission }) => {
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
                                1.1.1. Bằng việc sử dụng các dịch vụ và tài nguyên trên nền tảng của chúng tôi, bạn đồng
                                ý tuân thủ theo các điều khoản và điều kiện dưới đây.
                            </p>
                            <h4 className="font-semibold">1.2 Quy tắc đạo đức:</h4>
                            <p className="text-sm">
                                Không chấp nhận bất kỳ hành vi xâm phạm đạo đức nào, bao gồm lạm dụng, đe dọa hoặc gây
                                nguy hiểm cho học viên khác.
                            </p>
                            <h3 className="font-bold">2. Nghĩa vụ của Giáo viên:</h3>
                            <h4 className="font-semibold">2.1 Nội dung khóa học:</h4>
                            <p className="text-sm">
                                2.1.1. Bạn cam kết rằng tất cả các tài liệu, bài giảng, và nội dung khác mà bạn chia sẻ
                                là độc quyền và tuân thủ theo quy định về bản quyền.
                            </p>
                            <h4 className="font-semibold">2.2 Cam kết khóa học:</h4>
                            <p className="text-sm">
                                2.2.1. Chúng tôi cam kết rằng tất cả các tài liệu, bài giảng, và nội dung đã được học
                                viên thanh toán sẽ có quyền truy cập trọn đời cả khi bạn xóa khóa học.
                            </p>
                            <h3 className="font-bold">3. Quyền lợi của Giáo viên:</h3>
                            <h4 className="font-semibold">3.1 Quản lý giá:</h4>
                            <p className="text-sm">
                                3.1.1. Bạn có quyền tự quyết định về giá của khóa học của mình, nhưng giá này phải được
                                công bố và không thể thay đổi một cách đột ngột.
                            </p>
                            <h4 className="font-semibold">3.2 Quản lý nội dung:</h4>
                            <p className="text-sm">
                                3.2.1. Bạn giữ quyền kiểm soát nội dung khóa học và có thể chỉnh sửa, xoá hoặc thêm vào
                                nó theo nhu cầu.
                            </p>
                            <h3 className="font-bold">4. Thanh toán và Hoàn trả:</h3>
                            <h4 className="font-semibold">4.1 Thanh toán:</h4>
                            <p className="text-sm">
                                4.1.1. Bạn sẽ nhận được thanh toán theo thỏa thuận khi đạt được một số mục tiêu quy
                                định.
                            </p>
                            <h4 className="font-semibold">4.2 Hoàn trả:</h4>
                            <p className="text-sm">
                                4.2.1. Chính sách hoàn trả sẽ được áp dụng theo quy định cụ thể trong hợp đồng giữa bạn
                                và học viên.
                            </p>
                            <h3 className="font-bold">5. Sửa đổi điều khoản:</h3>
                            <h4 className="font-semibold">5.1 Điều khoản:</h4>
                            <p className="text-sm">
                                5.1.1. Chúng tôi có quyền điều chỉnh và sửa đổi các điều khoản này mà không cần thông
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

export default CourseRuleModal;
