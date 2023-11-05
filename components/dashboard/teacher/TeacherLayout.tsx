'use client';

import React, { useEffect, useState } from 'react';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import Sidebar from '../Sidebar';
import { useUser } from '@/hooks';
import { SafeUser, User } from '@/types';
import NotFound from '@/app/not-found';
import { handleUserReload } from '@/utils/handleUserReload';
import Loader from '@/components/Loader';

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
    getItem(<Link href="/teacher">Thông tin chung</Link>, '1', <PieChartOutlined />),
    getItem(<Link href="/teacher/profile">Cập nhật hồ sơ</Link>, '2', <UserOutlined />),
    getItem('Video', 'sub1', <DesktopOutlined />, [
        getItem(<Link href="/teacher/video/upload">Đăng tải video mới</Link>, '3'),
        getItem(<Link href="/teacher/video/my-video">Video của tôi</Link>, '4')
    ]),
    getItem('Khóa học', 'sub2', <TeamOutlined />, [
        getItem(<Link href="/teacher/course/create">Tạo khóa học</Link>, '5'),
        getItem(<Link href="/teacher/course/my-course">Khóa học của tôi</Link>, '6')
    ]),
    getItem('Bài tập', 'sub3', <TeamOutlined />, [
        getItem(<Link href="/teacher/quiz/create">Tạo bài tập</Link>, '7'),
        getItem(<Link href="/teacher/quiz/my-quiz">Danh sách bài tập</Link>, '8')
    ]),
    getItem('Thống kê', 'sub4', <TeamOutlined />, [
        getItem(<Link href="/teacher/statistic/revenue">Doanh thu</Link>, '9'),
        getItem(<Link href="/teacher/statistic/course-video">Khóa học & video</Link>, '10'),
        getItem(<Link href="/teacher/statistic/users">Học sinh</Link>, '11')
    ]),
    getItem(<Link href="/teacher/transaction">Giao dịch</Link>, '12', <FileOutlined />),
    getItem(<Link href="/teacher/notification">Thông báo</Link>, '13', <PieChartOutlined />),
    getItem(<Link href="/teacher/discuss">Thảo luận</Link>, '14', <PieChartOutlined />)
];

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
    const currentUser = useUser();
    const [user, setUser] = useState<SafeUser | null>(currentUser.user);
    const [notFound, setNotFound] = useState<boolean>(false);
    useEffect(() => {
        const handleReload = async () => {
            if (!currentUser.user) {
                const userSession = await handleUserReload();
                if (!userSession) {
                    setNotFound(true);
                } else currentUser.onChangeUser(userSession as SafeUser);
                setUser(userSession);
            }
        };
        handleReload();
    }, [currentUser.user]);

    if (!notFound && !user) return <Loader />;
    if ((user && user.role !== 'TEACHER') || notFound) return <NotFound />;

    return (
        <Sidebar user={user as User} items={items}>
            {children}
        </Sidebar>
    );
};

export default TeacherLayout;