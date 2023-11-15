import { create } from 'zustand';

interface ConfirmModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    title: string;
    type: 'success' | 'danger' | 'warning' | 'loading';
    content: string;
    activeFn: () => void;
    onSuccess: ({ title, content, activeFn }: { title: string; content: string; activeFn?: () => void }) => void;
    onDanger: ({ title, content, activeFn }: { title: string; content: string; activeFn?: () => void }) => void;
    onWarning: ({ title, content, activeFn }: { title: string; content: string; activeFn?: () => void }) => void;
    onLoading: () => void;
}

export const useCustomModal = create<ConfirmModalStore>(set => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    title: '',
    type: 'danger',
    content: '',
    activeFn: () => {},
    onSuccess: ({ title, content, activeFn = () => set({ isOpen: false }) }) =>
        set({
            type: 'success',
            title,
            content,
            activeFn
        }),
    onWarning: ({ title, content, activeFn = () => set({ isOpen: false }) }) =>
        set({
            type: 'warning',
            title,
            content,
            activeFn
        }),
    onDanger: ({ title, content, activeFn = () => set({ isOpen: false }) }) =>
        set({
            type: 'danger',
            title,
            content,
            activeFn: activeFn
        }),
    onLoading: () =>
        set({
            type: 'loading',
            title: 'Vui lòng chờ',
            content: '',
            activeFn: () => set({ isOpen: false })
        })
}));
