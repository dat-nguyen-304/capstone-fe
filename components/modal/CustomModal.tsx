'use client';

import { useCustomModal } from '@/hooks';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import Image from 'next/image';
import { PuffLoader } from 'react-spinners';

interface CustomModalProps {}

const CustomModal: React.FC<CustomModalProps> = () => {
    const { isOpen, title, type, content, onClose, activeFn } = useCustomModal();

    const imgBody = (key: typeof type) => {
        switch (key) {
            case 'success':
                return <Image alt="" src={`/modal/success.gif`} width={120} height={120} />;
            case 'loading':
                return <PuffLoader size={120} color="blue" />;
            default:
                return <Image alt="" src={`/modal/${type}.png`} width={70} height={70} />;
        }
    };

    const btnFooter = (key: typeof type) => {
        switch (key) {
            case 'success':
                return (
                    <Button color="primary" onPress={activeFn}>
                        Đóng
                    </Button>
                );
            case 'danger':
                return (
                    <Button color="primary" onPress={activeFn}>
                        Đóng
                    </Button>
                );
            case 'loading':
                return <></>;
            default:
                return (
                    <>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Hủy bỏ
                        </Button>
                        <Button color="primary" onPress={activeFn}>
                            Đồng ý
                        </Button>
                    </>
                );
        }
    };

    return (
        <Modal isOpen={isOpen} size="xl" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                    <div className="mx-auto">{imgBody(type)}</div>
                    <p className={`${type === 'danger' && 'text-red-500'}   mt-4 text-center`}>{content}</p>
                </ModalBody>
                <ModalFooter>{btnFooter(type)}</ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CustomModal;
