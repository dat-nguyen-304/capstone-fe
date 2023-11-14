import { create } from 'zustand';

interface ConfirmModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    title: string;
    onTitle: (title: string) => void;
    type: 'success' | 'danger' | 'warning' | 'loading';
    onType: (type: 'success' | 'danger' | 'warning' | 'loading') => void;
    content: string;
    onContent: (content: string) => void;
    activeFn: () => void;
    onActiveFn: (activeFn: () => void) => void;
}

export const useConfirmModal = create<ConfirmModalStore>(set => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    title: '',
    onTitle: (title: string) => set({ title }),
    type: 'danger',
    onType: (type: 'success' | 'danger' | 'warning' | 'loading') => set({ type }),
    content: '',
    onContent: (content: string) => set({ content }),
    activeFn: () => {},
    onActiveFn: (activeFn: () => void) => set({ activeFn })
}));
