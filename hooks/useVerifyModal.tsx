import { FileWithPath } from 'react-dropzone';
import { create } from 'zustand';

interface VerifyModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    isSubmitting: boolean;
    onSubmitting: (isSubmitting: boolean) => void;
    cardNumber: string;
    subjectId: number[] | null;
    onCardNumber: (cardNumber: string) => void;
    onSubjectId: (subjectId: []) => void;
    file: FileWithPath | null;
    onFile: (file: FileWithPath | null) => void;
}

export const useVerifyModal = create<VerifyModalStore>(set => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    isSubmitting: false,
    onSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),
    cardNumber: '',
    subjectId: [],
    onCardNumber: (cardNumber: string) => set({ cardNumber }),
    onSubjectId: (subjectId: []) => set({ subjectId }),
    file: null,
    onFile: (file: FileWithPath | null) => set({ file })
}));
