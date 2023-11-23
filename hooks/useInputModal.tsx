import { create } from 'zustand';

interface InputModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    description: string;
    onDescription: (description: string) => void;
    activeFn: () => void;
    onActiveFn: (activeFn: () => void) => void;
}

export const useInputModal = create<InputModalStore>(set => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    description: '',
    onDescription: (description: string) => set({ description }),
    activeFn: () => {},
    onActiveFn: (activeFn: () => void) => set({ activeFn })
}));
