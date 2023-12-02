import { create } from 'zustand';

interface ReportModalStore {
    examTitle: string;
    onExamTitle: (examTitle: string) => void;
    progress: {
        courseName: string;
        done: number;
        total: number;
        quizNumber: number;
        videoNumber: number;
    };
    onProgress: (progress: {
        courseName: string;
        done: number;
        total: number;
        quizNumber: number;
        videoNumber: number;
    }) => void;
}

export const useReportModal = create<ReportModalStore>(set => ({
    examTitle: 'Bài kiểm tra',
    onExamTitle: (examTitle: string) => set({ examTitle }),
    progress: {
        courseName: 'Khóa học',
        done: 0,
        total: 0,
        quizNumber: 0,
        videoNumber: 0
    },
    onProgress: (progress: {
        courseName: string;
        done: number;
        total: number;
        quizNumber: number;
        videoNumber: number;
    }) => set({ progress })
}));
