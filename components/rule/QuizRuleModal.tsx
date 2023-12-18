'use client';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

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
                                Bằng cách tạo và quản lý bài tập trên nền tảng của chúng tôi, bạn đồng ý và tuân thủ
                                theo các điều khoản và điều kiện dưới đây.
                            </p>

                            <h3 className="font-bold">2. Trách nhiệm và Chất lượng:</h3>
                            <h4 className="font-semibold">2.1 Chất lượng bài tập:</h4>
                            <p className="text-sm">Bạn cam kết cung cấp bài tập chất lượng cho học viên.</p>
                            <h4 className="font-semibold">2.2. Tuân thủ quy định:</h4>
                            <p className="text-sm">
                                Bạn đồng ý không tạo bài tập vi phạm quy định, đạo đức, hoặc chính sách của chúng tôi.
                            </p>
                            <h3 className="font-bold">3. Sửa đổi điều khoản:</h3>
                            <p className="text-sm">Bạn nên kiểm tra định kỳ để cập nhật với những thay đổi mới.</p>
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
