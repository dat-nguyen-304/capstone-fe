import AdminLayout from '@/components/dashboard/admin/AdminLayout';
import ConfirmModal from '@/components/modal/ConfirmModal';
import React from 'react';

export const metadata = {
    title: 'CEPA - Admin',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const Layout = ({ children }: { children: React.ReactNode }) => (
    <AdminLayout>
        {children}
        <ConfirmModal />
    </AdminLayout>
);

export default Layout;
