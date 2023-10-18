import TeacherLayout from '@/components/dashboard/TeacherLayout';
import React from 'react';

export const metadata = {
    title: 'CEPA - Giáo viên',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const StudentLayout = ({ children }: { children: React.ReactNode }) => <TeacherLayout>{children}</TeacherLayout>;

export default StudentLayout;
