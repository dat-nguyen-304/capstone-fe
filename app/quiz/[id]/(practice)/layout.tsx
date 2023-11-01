import DoTestHeader from '@/components/header/DoTestHeader';
import React from 'react';

export const metadata = {
    title: 'CEPA - Luyện đề',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const PracticeQuizLayout = ({ children, params }: { children: React.ReactNode; params: { id: number } }) => (
    <div className="mb-16">
        <DoTestHeader type="quiz" id={params.id} />
        {children}
    </div>
);

export default PracticeQuizLayout;
