'use client';

import React from 'react';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import Sidebar from '../Sidebar';
import { useUser } from '@/hooks';
import { User } from '@/types';
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
    getItem(<Link href="/admin">Thông tin chung</Link>, '1', <PieChartOutlined />),
    getItem('Quản lí user', 'sub1', <DesktopOutlined />, [
        getItem(<Link href="/admin/teacher">Giáo viên</Link>, '2'),
        getItem(<Link href="/admin/student">Học sinh</Link>, '3')
    ]),
    getItem('Quản lí khóa học', 'sub2', <TeamOutlined />, [
        getItem(<Link href="/admin/course">Khóa học</Link>, '4'),
        getItem(<Link href="/admin/video">Video</Link>, '5'),
        getItem(<Link href="/admin/quiz">Câu hỏi ôn tập</Link>, '6')
    ]),
    getItem(<Link href="/admin/revenue">Quản lí doanh thu</Link>, '7', <FileOutlined />),
    getItem(<Link href="/admin/report">Quản lí báo cáo</Link>, '8', <PieChartOutlined />),
    getItem(<Link href="/admin/test">Quản lí đề thi</Link>, '9', <PieChartOutlined />),
    getItem(<Link href="/admin/discussion">Quản lí thảo luận</Link>, '10', <PieChartOutlined />)
];

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();
    if (!user) return <NotFound />;
    if (user.role !== 'ADMIN') return <NotFound />;
    return (
        <Sidebar user={user as User} items={items}>
            {children}
        </Sidebar>
    );
};

export default TeacherLayout;
