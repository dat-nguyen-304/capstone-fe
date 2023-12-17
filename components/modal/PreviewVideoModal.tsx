'use client';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import ReactPlayer from 'react-player';

interface PreviewVideoModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onOpenChange: () => void;
    url: string;
    name: string;
}

export const PreviewVideoModal: React.FC<PreviewVideoModalProps> = ({ isOpen, onOpenChange, url, name }) => {
    return (
        <Modal isOpen={isOpen} size="4xl" onOpenChange={onOpenChange}>
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Video xem trước</ModalHeader>
                        <ModalBody>
                            <ReactPlayer
                                width="100%"
                                height="450px"
                                className="object-contain"
                                controls={true}
                                url={
                                    url ||
                                    'https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5'
                                }
                            />
                            <h3 className="font-semibold mt-4">{name}</h3>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="bg-white" variant="bordered" onPress={onClose}>
                                Đóng
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
