import DoTestHeader from '@/components/header/DoTestHeader';
import React from 'react';

export const metadata = {
    title: 'CEPA - Kiểm tra',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const PracticeQuizLayout = ({
    children,
    params
}: {
    children: React.ReactNode;
    params: { courseId: number; id: number };
}) => (
    <div className="mb-16">
        <DoTestHeader type="quiz" id={params.id}>
            {children}
        </DoTestHeader>
    </div>
);

export default PracticeQuizLayout;
