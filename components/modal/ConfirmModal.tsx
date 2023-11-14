'use client';

import { useConfirmModal } from '@/hooks';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';

interface ApproveModalProps {}

const ConfirmModal: React.FC<ApproveModalProps> = () => {
    const { isOpen, title, type, content, onClose, activeFn } = useConfirmModal();
    console.log(isOpen);
    return (
        <Modal isOpen={isOpen} size="xl" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
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
                    <Button color="primary" onPress={activeFn}>
                        Đồng ý
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmModal;
