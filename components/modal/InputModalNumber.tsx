'use client';

import { useInputModalNumber } from '@/hooks';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { NumberFormatBase } from 'react-number-format';
import { toast } from 'react-toastify';

interface InputModalNumberProps {
    activeFn: () => void;
}

export const InputModalNumber: React.FC<InputModalNumberProps> = ({ activeFn }) => {
    const { isOpen, onClose, money, onMoney, onTransactionCode, transactionCode } = useInputModalNumber();
    const formatVnd = (numStr: string) => {
        if (numStr === '') return '';
        return new Intl.NumberFormat('vi-VI', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(numStr as any);
    };
    const isValidInput = () => {
        return transactionCode.trim().length >= 6 && !isNaN(money) && money > 0;
    };
    return (
        <Modal isOpen={isOpen} size="xl" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-center">Nhập thông tin chuyển tiền</ModalHeader>
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
                        Nhập số tiền
                        <span className="text-[#f31260]">*</span>
                    </label>
                    <NumberFormatBase
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        format={formatVnd}
                        name="money"
                        value={0}
                        // onChange={e => onMoney?.(Number(e.target.value))}
                        onValueChange={values => {
                            const { value } = values;
                            onMoney?.(Number(value));
                        }}
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
