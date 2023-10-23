'use client';

import React from 'react';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { useUser } from '@/hooks';
import { Teacher } from '@/types';
import NotFound from '@/app/not-found';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
        key,
        icon,
        children,
        label
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem(<Link href="/teacher">Bảng điều khiển</Link>, '1', <PieChartOutlined />),
    getItem(<Link href="/teacher/profile">Cập nhật hồ sơ</Link>, '2', <UserOutlined />),
    getItem('Video', 'sub1', <DesktopOutlined />, [
        getItem(<Link href="/teacher/upload-video">Đăng tải video mới</Link>, '3'),
        getItem(<Link href="/teacher/my-video">Video của tôi</Link>, '4')
    ]),
    getItem('Khóa học', 'sub2', <TeamOutlined />, [
        getItem(<Link href="/teacher/create-course">Tạo khóa học</Link>, '5'),
        getItem(<Link href="/teacher/my-course">Khóa học của tôi</Link>, '6')
    ]),
    getItem('Bài tập', 'sub3', <TeamOutlined />, [
        getItem(<Link href="/teacher/create-quiz">Tạo bài tập</Link>, '7'),
        getItem(<Link href="/teacher/quizzes">Danh sách bài tập</Link>, '8')
    ]),
    getItem('Thống kê', 'sub4', <TeamOutlined />, [
        getItem(<Link href="/teacher/statistic/revenue">Doanh thu</Link>, '9'),
        getItem(<Link href="/teacher/statistic/courses-videos">Khóa học & video</Link>, '10'),
        getItem(<Link href="/teacher/statistic/users">Học sinh</Link>, '11')
    ]),
    getItem(<Link href="/teacher/transaction">Giao dịch</Link>, '12', <FileOutlined />),
    getItem(<Link href="/teacher/notification">Thông báo</Link>, '13', <PieChartOutlined />),
    getItem(<Link href="/teacher/discuss">Thảo luận</Link>, '14', <PieChartOutlined />)
];

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();
    if (!user) return <NotFound />;
    return (
        <Sidebar teacher={user as Teacher} items={items}>
            {children}
        </Sidebar>
    );
};

export default TeacherLayout;
