import Footer from '@/components/footer';
import Header from '@/components/header';
import React from 'react';

export const metadata = {
    title: 'CEPA',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const StudentLayout = ({ children }: { children: React.ReactNode }) => (
    <>
        <Header />
        {children}
        <Footer />
    </>
);

export default StudentLayout;
