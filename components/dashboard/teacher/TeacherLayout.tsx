'use client';

import React, { useEffect, useState } from 'react';
import {
    PlaySquareOutlined,
    LineChartOutlined,
    BellOutlined,
    CalculatorOutlined,
    IdcardOutlined,
    CommentOutlined,
    BarChartOutlined,
    AuditOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import Sidebar from '../Sidebar';
import { useUser } from '@/hooks';
import { SafeUser } from '@/types';
import NotFound from '@/app/not-found';
import { handleUserReload } from '@/utils/handleUserReload';
import Loader from '@/components/Loader';
import { Chip } from '@nextui-org/react';

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
    getItem(<Link href="/teacher">Thông tin chung</Link>, '1', <BarChartOutlined />),
    getItem(<Link href="/teacher/edit-profile">Cập nhật hồ sơ</Link>, '2', <IdcardOutlined />),
    getItem('Video', 'sub1', <PlaySquareOutlined />, [
        getItem(<Link href="/teacher/video/upload">Đăng tải video mới</Link>, '3'),
        getItem(<Link href="/teacher/video/my-video">Video của tôi</Link>, '4'),
        getItem(<Link href="/teacher/video/my-video-draft">Video vừa tạo</Link>, '5')
    ]),
    getItem('Khóa học', 'sub2', <AuditOutlined />, [
        getItem(<Link href="/teacher/course/create">Tạo khóa học</Link>, '6'),
        getItem(<Link href="/teacher/course/my-course">Khóa học của tôi</Link>, '7'),
        getItem(<Link href="/teacher/course/my-course-draft">Khóa học vừa tạo</Link>, '8')
    ]),
    // getItem('Bài tập', 'sub3', <CalculatorOutlined />, [
    //     getItem(<Link href="/teacher/quiz/create">Tạo bài tập</Link>, '9'),
    //     getItem(<Link href="/teacher/quiz">Danh sách bài tập</Link>, '10')
    // ]),
    getItem('Thảo luận', 'sub4', <CommentOutlined />, [
        getItem(<Link href="/teacher/discussion">Tất cả bài đăng</Link>, '11'),
        getItem(<Link href="/teacher/discussion/create">Tạo bài đăng</Link>, '12'),
        getItem(<Link href="/teacher/discussion/my-post">Bài đăng của tôi</Link>, '13')
    ]),
    getItem(<Link href="/teacher/transaction">Giao dịch</Link>, '14', <LineChartOutlined />),
    getItem(
        <div className="relative">
            <Link href="/teacher/notification">Thông báo</Link>
            <Chip color="primary" size="sm" className="absolute top-0 translate-y-[50%] right-0">
                10
            </Chip>
        </div>,
        '15',
        <BellOutlined />
    )
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
        <Sidebar user={user as SafeUser} items={items}>
            {children}
        </Sidebar>
    );
};

export default TeacherLayout;
