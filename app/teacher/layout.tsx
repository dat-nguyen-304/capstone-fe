import TeacherLayout from '@/components/dashboard/teacher/TeacherLayout';
import React from 'react';

export const metadata = {
    title: 'CEPA - Giáo viên',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const Layout = ({ children }: { children: React.ReactNode }) => <TeacherLayout>{children}</TeacherLayout>;

export default Layout;
