import React from 'react';
import { Mulish } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/components/provider/ReactQueryProvider';
import AntdProvider from '@/components/provider/AntdProvider';
import NextUiProvider from '@/components/provider/NextUiProvider';
import { CustomModal } from '@/components/modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Mulish({ subsets: ['latin'] });

export const metadata = {
    title: 'CEPA',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <html lang="en">
        <body className={inter.className}>
            <ReactQueryProvider>
                <AntdProvider>
                    <NextUiProvider>
                        {children}
                        <CustomModal />
                        <ToastContainer />
                    </NextUiProvider>
                </AntdProvider>
            </ReactQueryProvider>
        </body>
    </html>
);

export default RootLayout;
