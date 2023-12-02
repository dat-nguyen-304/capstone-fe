import { create } from 'zustand';

interface InputModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    description: string;
    onDescription: (description: string) => void;
    money?: number;
    onMoney?: (money: number) => void;
}
interface InputModalNumberStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    transactionCode: string;
    onTransactionCode: (transactionCode: string) => void;
    money: number;
    onMoney: (money: number) => void;
}
interface InputModalRefund {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    transactionCode: string;
    onTransactionCode: (transactionCode: string) => void;
    reason: string;
    onReason: (reason: string) => void;
}

export const useInputModal = create<InputModalStore>(set => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    description: '',
    onDescription: (description: string) => set({ description })
}));

export const useInputModalNumber = create<InputModalNumberStore>(set => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    transactionCode: '',
    onTransactionCode: (transactionCode: string) => set({ transactionCode }),
    money: 0,
    onMoney: (money: number) => set({ money })
}));
export const useInputModalRefund = create<InputModalRefund>(set => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    transactionCode: '',
    onTransactionCode: (transactionCode: string) => set({ transactionCode }),
    reason: '',
    onReason: (reason: string) => set({ reason })
}));
