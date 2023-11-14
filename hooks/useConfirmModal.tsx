import { create } from 'zustand';

interface ConfirmModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    title: string;
    onTitle: (title: string) => void;
    type: 'success' | 'danger' | 'warning';
    onType: (type: 'success' | 'danger' | 'warning') => void;
    content: string;
    onContent: (content: string) => void;
    activeFn: () => void;
    onActiveFn: (activeFn: () => void) => void;
}

export const useConfirmModal = create<ConfirmModalStore>(set => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    title: 'Chưa cập nhật',
    onTitle: (title: string) => set({ title }),
    type: 'danger',
    onType: (type: 'success' | 'danger' | 'warning') => set({ type }),
    content: 'Chưa cập nhật',
    onContent: (content: string) => set({ content }),
    activeFn: () => {},
    onActiveFn: (activeFn: () => void) => set({ activeFn })
}));
