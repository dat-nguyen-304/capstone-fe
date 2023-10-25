import TestResultHeader from '@/components/header/TestResultHeader';
import React from 'react';

export const metadata = {
    title: 'CEPA - Kết quả bài làm',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const StudentLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-8">
        <TestResultHeader />
        {children}
    </div>
);

export default StudentLayout;
