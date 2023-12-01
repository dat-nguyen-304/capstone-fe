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
    money?: number;
    onMoney?: (money: number) => void;
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
    money: 0,
    onMoney: (money: number) => set({ money })
}));
