'use client';
import React from 'react';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'CEPA',
    description: 'Nền tảng ôn thi Đại học số 1 Việt Nam'
};

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 4000 } }
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <html lang="en">
        <body className={inter.className}>
            <QueryClientProvider client={queryClient}>
                <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
                <ReactQueryDevtools />
            </QueryClientProvider>
        </body>
    </html>
);

export default RootLayout;
