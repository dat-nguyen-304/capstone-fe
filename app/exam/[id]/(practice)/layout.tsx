import DoTestHeader from '@/components/header/DoTestHeader';
import React from 'react';

export const metadata = {
    title: 'CEPA - Luyện đề',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const StudentLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-16">
        <DoTestHeader />
        {children}
    </div>
);

export default StudentLayout;
