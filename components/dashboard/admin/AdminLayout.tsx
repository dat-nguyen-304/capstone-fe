'use client';

import React, { useEffect, useState } from 'react';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined } from '@ant-design/icons';
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
    getItem(<Link href="/admin">Thông tin chung</Link>, '1', <PieChartOutlined />),
    getItem('Người dùng', 'sub1', <DesktopOutlined />, [
        getItem(<Link href="/admin/teacher">Giáo viên</Link>, '2'),
        getItem(<Link href="/admin/student">Học sinh</Link>, '3')
    ]),
    getItem('Học tập', 'sub2', <TeamOutlined />, [
        getItem(<Link href="/admin/course">Khóa học</Link>, '4'),
        getItem(<Link href="/admin/video">Video</Link>, '5'),
        getItem(<Link href="/admin/quiz">Câu hỏi ôn tập</Link>, '6')
    ]),
    getItem('Đề thi', 'sub3', <TeamOutlined />, [
        getItem(<Link href="/admin/exam">Tất cả đề thi</Link>, '7'),
        getItem(<Link href="/admin/exam/create">Tạo đề thi</Link>, '8')
    ]),
    getItem('Phê duyệt', 'sub4', <TeamOutlined />, [
        getItem(<Link href="/admin/approve/course">Khóa học</Link>, '9'),
        getItem(<Link href="/admin/approve/video">Video</Link>, '10')
    ]),
    getItem(<Link href="/admin/transaction">Giao dịch</Link>, '11', <FileOutlined />),
    getItem(<Link href="/admin/report">Xử lý vi phạm</Link>, '12', <PieChartOutlined />),
    getItem(<Link href="/admin/discussion">Thảo luận</Link>, '13', <PieChartOutlined />),
    getItem(
        <div className="relative">
            <Link href="/admin/notification">Thông báo</Link>
            <Chip color="primary" size="sm" className="absolute top-0 translate-y-[50%] right-0">
                10
            </Chip>
        </div>,
        '14',
        <PieChartOutlined />
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
    if ((user && user.role !== 'ADMIN') || notFound) return <NotFound />;

    return (
        <Sidebar user={user as SafeUser} items={items}>
            {children}
        </Sidebar>
    );
};

export default TeacherLayout;
