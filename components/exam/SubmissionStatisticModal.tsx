'use client';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { Progress } from 'antd';

interface SubmissionStatisticProps {
    submission?: any;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const SubmissionStatisticModal: React.FC<SubmissionStatisticProps> = ({ isOpen, onOpen, onClose, submission }) => {
    return (
        <Modal size="5xl" isOpen={isOpen} onClose={onClose} className="!sm:mt-6 sm:mb-4">
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Thống kê</ModalHeader>
                        <ModalBody>
                            {submission?.length ? (
                                submission?.map((userStat: any) => (
                                    <li key={userStat?.id} className="text-xs xl:flex mt-4">
                                        <h3 className="w-[500px] truncate">{userStat?.topic?.name}</h3>
                                        <Progress
                                            className="w-full"
                                            percent={Number(
                                                (
                                                    (userStat?.correctCount /
                                                        (userStat?.correctCount + userStat?.incorrectCount)) *
                                                    100
                                                )?.toFixed(2)
                                            )}
                                        />
                                    </li>
                                ))
                            ) : (
                                <>Chưa có dữ liệu</>
                            )}
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

export default SubmissionStatisticModal;
