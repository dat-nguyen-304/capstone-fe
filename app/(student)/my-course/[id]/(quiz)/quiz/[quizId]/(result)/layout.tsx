import TestResultHeader from '@/components/header/TestResultHeader';
import React from 'react';

export const metadata = {
    title: 'CEPA - Kết quả bài làm',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const QuizResultLayout = ({ children, params }: { children: React.ReactNode; params: { id: number } }) => (
    <div className="mb-8">
        <TestResultHeader type="quiz" id={params.id}>
            {children}
        </TestResultHeader>
    </div>
);

export default QuizResultLayout;
