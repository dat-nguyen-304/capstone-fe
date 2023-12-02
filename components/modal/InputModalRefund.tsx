'use client';
import { useInputModal, useInputModalNumber, useInputModalRefund } from '@/hooks';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { InputNumber } from '../form-input/InputNumber';
import { NumberFormatBase } from 'react-number-format';
import { toast } from 'react-toastify';

interface InputModalRefundProps {
    activeFn: () => void;
}

export const InputModalRefund: React.FC<InputModalRefundProps> = ({ activeFn }) => {
    const { isOpen, onClose, reason, onReason, onTransactionCode, transactionCode } = useInputModalRefund();

    const isValidInput = () => {
        return transactionCode.trim().length >= 6 && reason.trim().length > 6;
    };
    return (
        <Modal isOpen={isOpen} size="xl" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-center">Nhập thông tin hoàn tiền</ModalHeader>
                <ModalBody>
                    <label className="mb-1 block font-semibold text-[#3974f0]">
                        Mã giao dịch
                        <span className="text-[#f31260]">*</span>
                    </label>
                    <Input
                        value={transactionCode}
                        name="transactionCode"
                        required
                        minLength={6}
                        onChange={e => onTransactionCode(e.target.value)}
                    />
                    <label className="mb-1 block font-semibold text-[#3974f0]">
                        Nội dung
                        <span className="text-[#f31260]">*</span>
                    </label>
                    <Input
                        value={reason}
                        name="reason"
                        required
                        minLength={6}
                        onChange={e => onReason(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Hủy bỏ
                    </Button>
                    <Button
                        color="primary"
                        onPress={() => {
                            if (isValidInput()) {
                                activeFn();
                            } else {
                                toast.error('Cần điền đầy đủ thông tin');
                            }
                        }}
                    >
                        Xác nhận
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
