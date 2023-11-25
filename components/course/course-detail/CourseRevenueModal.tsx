'use client';

import RevenueChart from '@/components/chart/teacher-dashboard/RevenueChart';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

interface CourseRevenueModalProps {
    courseId?: number;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const CourseRevenueModal: React.FC<CourseRevenueModalProps> = ({ isOpen, onOpen, onClose, courseId }) => {
    return (
        <Modal size="5xl" isOpen={isOpen} onClose={onClose} className="!sm:mt-6 sm:mb-4">
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Thống kê doanh thu</ModalHeader>
                        <ModalBody>
                            <RevenueChart courseId={courseId} />
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
