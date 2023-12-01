'use client';
import { useInputModal, useInputModalNumber } from '@/hooks';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { InputNumber } from '../form-input/InputNumber';
import { NumberFormatBase } from 'react-number-format';

interface InputModalNumberProps {
    activeFn: () => void;
}

export const InputModalNumber: React.FC<InputModalNumberProps> = ({ activeFn }) => {
    const { isOpen, onClose, money, onMoney } = useInputModalNumber();
    const moneyValue = money?.toString() ?? '';
    const formatVnd = (numStr: string) => {
        if (numStr === '') return '';
        return new Intl.NumberFormat('vi-VI', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(numStr as any);
    };
    return (
        <Modal isOpen={isOpen} size="xl" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-center">Nhập số tiền chuyển</ModalHeader>
                <ModalBody>
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
                    <Button color="primary" onPress={activeFn}>
                        Xác nhận
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
