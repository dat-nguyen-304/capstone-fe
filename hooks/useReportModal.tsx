import { FileWithPath } from 'react-dropzone';
import { create } from 'zustand';

interface ReportModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    reportType: 'integrity' | 'academy' | 'technical' | 'opinion' | 'other';
    contentType: 'comment' | 'discussion' | 'exam' | 'quiz' | 'video';
    onReportType: (reportType: 'integrity' | 'academy' | 'technical' | 'opinion' | 'other') => void;
    onContentType: (contentType: 'comment' | 'discussion' | 'exam' | 'quiz' | 'video') => void;
    description: string;
    onDescription: (description: string) => void;
    file: FileWithPath | null;
    onFile: (file: FileWithPath | null) => void;
    activeFn: () => void;
    onActiveFn: (activeFn: () => void) => void;
}

export const useReportModal = create<ReportModalStore>(set => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    reportType: 'integrity',
    contentType: 'comment',
    onReportType: (reportType: 'integrity' | 'academy' | 'technical' | 'opinion' | 'other') => set({ reportType }),
    onContentType: (contentType: 'comment' | 'discussion' | 'exam' | 'quiz' | 'video') => set({ contentType }),
    description: '',
    onDescription: (description: string) => set({ description }),
    file: null,
    onFile: (file: FileWithPath | null) => set({ file }),
    activeFn: () => {},
    onActiveFn: (activeFn: () => void) => set({ activeFn })
}));
