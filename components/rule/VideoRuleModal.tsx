'use client';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

interface VideoRuleProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const VideoRuleModal: React.FC<VideoRuleProps> = ({ isOpen, onOpen, onClose }) => {
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
                                Việc sử dụng và đăng video trên nền tảng của chúng tôi đồng nghĩa với việc bạn đồng ý và
                                tuân thủ theo tất cả các điều khoản và điều kiện dưới đây.
                            </p>
                            <h4 className="font-semibold">1.2 Quy tắc đạo đức:</h4>
                            <p className="text-sm">
                                1.2.1 Bạn giữ quyền sở hữu bản quyền của tất cả các video bạn đăng lên nền tảng của
                                chúng tôi.
                                <br />
                                1.2.2. Chúng tôi có quyền sử dụng, sao chép, phát sóng và phân phối video của bạn để hỗ
                                trợ quảng bá và phát triển nền tảng.
                            </p>
                            <h3 className="font-bold">2. Nghĩa vụ của Giáo viên:</h3>
                            <h4 className="font-semibold">2.1 Nội dung chất lượng:</h4>
                            <p className="text-sm">
                                2.1.1. Bạn cam kết cung cấp video chất lượng, hữu ích và có giá trị cho cộng đồng học
                                viên.
                                <br />
                                2.1.2 Tài liệu đăng tải yêu cầu là file .pdf
                                <br />
                                2.1.3 Video đăng tải không được vượt quá 500MB
                            </p>
                            <h4 className="font-semibold">2.2. Tuân thủ quy định:</h4>
                            <p className="text-sm">
                                Bạn đồng ý không đăng tải hoặc chia sẻ bất kỳ nội dung vi phạm pháp luật hoặc chính sách
                                của chúng tôi.
                            </p>

                            <h3 className="font-bold">3. Bảo mật và Quyền riêng tư:</h3>
                            <h4 className="font-semibold">3.1. Bảo mật thông tin:</h4>
                            <p className="text-sm">
                                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và không chia sẻ nó với bất kỳ bên
                                thứ ba nào mà không có sự đồng ý của bạn.
                            </p>
                            <h3 className="font-bold">4. Sửa đổi điều khoản:</h3>
                            <h4 className="font-semibold">4.1 Điều khoản:</h4>
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

export default VideoRuleModal;
