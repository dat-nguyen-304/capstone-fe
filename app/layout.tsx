import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/components/provider/ReactQueryProvider';
import AntdProvider from '@/components/provider/AntdProvider';
import NextUiProvider from '@/components/provider/NextUiProvider';
import Header from '@/components/header/Header';

const inter = Inter({ subsets: ['latin'] });

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
                        <Header currentUser={{ email: 'a@gmail.com' }} />
                        <div className="pb-20 pt-28">{children}</div>
                    </NextUiProvider>
                </AntdProvider>
            </ReactQueryProvider>
        </body>
    </html>
);

export default RootLayout;
