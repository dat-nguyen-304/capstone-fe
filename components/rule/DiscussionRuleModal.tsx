'use client';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

interface DiscussionRuleProps {
    submission?: any;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const DiscussionRuleModal: React.FC<DiscussionRuleProps> = ({ isOpen, onOpen, onClose, submission }) => {
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
                                Bằng cách đăng bài thảo luận trên nền tảng của chúng tôi, bạn đồng ý và tuân thủ theo
                                các điều khoản và điều kiện dưới đây.
                            </p>
                            <h4 className="font-semibold">1.2 Trách nhiệm:</h4>
                            <p className="text-sm">
                                Bạn chịu trách nhiệm đầy đủ về nội dung bạn đăng, đảm bảo rằng nó tuân thủ quy định và
                                không vi phạm các chính sách của chúng tôi.
                            </p>
                            <h3 className="font-bold">2. Nội dung và Hành vi:</h3>
                            <h4 className="font-semibold">2.1. Chất lượng nội dung:</h4>
                            <p className="text-sm">
                                Bạn cam kết cung cấp các bài thảo luận chất lượng, xây dựng và tích cực.
                            </p>
                            <h4 className="font-semibold">2.2. Tôn trọng:</h4>
                            <p className="text-sm">
                                Bạn đồng ý không thể hiện hành vi lạm dụng, phân biệt đối xử, hay xâm phạm quyền riêng
                                tư của người khác trong các bài thảo luận.
                            </p>
                            <h3 className="font-bold">3. Quyền lợi và Trách nhiệm:</h3>
                            <h4 className="font-semibold">3.1. Quản lý nội dung:</h4>
                            <p className="text-sm">
                                Chúng tôi có quyền xem xét, chỉnh sửa hoặc xóa bất kỳ bài thảo luận nào mà chúng tôi cho
                                là không tuân thủ các quy định và chính sách của chúng tôi.
                            </p>
                            <h4 className="font-semibold">3.2. Bảo vệ quyền riêng tư:</h4>
                            <p className="text-sm">
                                Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và không tiết lộ thông tin cá nhân không
                                được sự đồng ý của bạn.
                            </p>
                            <h3 className="font-bold">4. Hạn chế trách nhiệm:</h3>
                            <h4 className="font-semibold">4.1 Hạn chế trách nhiệm:</h4>
                            <p className="text-sm">
                                Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng thông
                                tin trong bài thảo luận.
                            </p>
                            <h3 className="font-bold">5. Sửa đổi điều khoản:</h3>
                            <h4 className="font-semibold">5.1 Điều khoản:</h4>
                            <p className="text-sm">
                                Chúng tôi có quyền điều chỉnh và sửa đổi các điều khoản này mà không cần thông báo
                                trước. Bạn nên kiểm tra định kỳ để cập nhật với những thay đổi mới.
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

export default DiscussionRuleModal;
