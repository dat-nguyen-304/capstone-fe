import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import Image from 'next/image';

interface ApproveModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    type: 'warning' | 'success' | 'danger';
    content: string;
}

const ConfirmModal: React.FC<ApproveModalProps> = ({ isOpen, onOpenChange, content, type }) => {
    return (
        <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                        <ModalBody>
                            <div className="mx-auto">
                                {type === 'success' ? (
                                    <Image alt="" src={`/modal/success.gif`} width={70} height={70} />
                                ) : (
                                    <Image alt="" src={`/modal/${type}.png`} width={70} height={70} />
                                )}
                            </div>
                            <p className="mt-4">{content}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Hủy bỏ
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Đồng ý
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ConfirmModal;
