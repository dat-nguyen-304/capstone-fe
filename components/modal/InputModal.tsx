'use client';
import { useInputModal } from '@/hooks';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

interface InputModalProps {
    activeFn: () => void;
}

export const InputModal: React.FC<InputModalProps> = ({ activeFn }) => {
    const { isOpen, onClose, description, onDescription } = useInputModal();

    return (
        <Modal isOpen={isOpen} size="xl" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-center">Mô tả lí do</ModalHeader>
                <ModalBody>
                    <Input
                        value={description}
                        name="description"
                        label="Mô tả"
                        onChange={e => onDescription(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Hủy bỏ
                    </Button>
                    <Button color="primary" onPress={activeFn}>
                        Xác nhận
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
