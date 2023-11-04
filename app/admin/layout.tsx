import AdminLayout from '@/components/dashboard/admin/AdminLayout';
import React from 'react';

export const metadata = {
    title: 'CEPA - ADMIN',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const Layout = ({ children }: { children: React.ReactNode }) => <AdminLayout>{children}</AdminLayout>;

export default Layout;
