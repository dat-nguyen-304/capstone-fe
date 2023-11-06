'use client';

import RevenueChart from '@/components/chart/teacher-dashboard/RevenueChart';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

interface CourseRevenueModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const CourseRevenueModal: React.FC<CourseRevenueModalProps> = ({ isOpen, onOpen, onClose }) => {
    return (
        <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Thống kê doanh thu</ModalHeader>
                        <ModalBody>
                            <RevenueChart />
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

export default CourseRevenueModal;
