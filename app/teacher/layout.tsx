import TeacherLayout from '@/components/dashboard/teacher/TeacherLayout';
import ConfirmModal from '@/components/modal/ConfirmModal';
import React from 'react';

export const metadata = {
    title: 'CEPA - Giáo viên',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const Layout = ({ children }: { children: React.ReactNode }) => (
    <TeacherLayout>
        {children}
        <ConfirmModal />
    </TeacherLayout>
);

export default Layout;
