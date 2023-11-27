'use client';

import React, { useEffect, useState } from 'react';
import {
    BarChartOutlined,
    LineChartOutlined,
    BellOutlined,
    TeamOutlined,
    AuditOutlined,
    CalculatorOutlined,
    CheckCircleOutlined,
    StopOutlined,
    CommentOutlined
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
import { InputModal } from '@/components/modal/InputModal';

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
    getItem(<Link href="/admin">Thông tin chung</Link>, '1', <BarChartOutlined />),
    getItem('Người dùng', 'sub1', <TeamOutlined />, [
        getItem(<Link href="/admin/teacher">Giáo viên</Link>, '2'),
        getItem(<Link href="/admin/student">Học sinh</Link>, '3')
    ]),
    getItem('Học tập', 'sub2', <AuditOutlined />, [
        getItem(<Link href="/admin/course">Khóa học</Link>, '4'),
        getItem(<Link href="/admin/video">Video</Link>, '5'),
        getItem(<Link href="/admin/quiz">Câu hỏi ôn tập</Link>, '6')
    ]),
    getItem('Đề thi', 'sub3', <CalculatorOutlined />, [
        getItem(<Link href="/admin/exam">Tất cả đề thi</Link>, '7'),
        getItem(<Link href="/admin/exam/create">Tạo đề thi</Link>, '8'),
        getItem(<Link href="/admin/exam-topic">Tất cả chủ đề thi</Link>, '9'),
        getItem(<Link href="/admin/exam-topic/create">Tạo chủ đề thi</Link>, '10')
    ]),
    // getItem('Phê duyệt', 'sub4', <CheckCircleOutlined />, [
    //     getItem(<Link href="/admin/approve/course">Khóa học</Link>, '11'),
    //     getItem(<Link href="/admin/approve/video">Video</Link>, '12')
    // ]),
    getItem(<Link href="/admin/approve/course">Phê duyệt khóa học</Link>, '11', <CheckCircleOutlined />),
    getItem(<Link href="/admin/transaction">Giao dịch</Link>, '12', <LineChartOutlined />),
    getItem('Xử lý vi phạm', 'sub4', <StopOutlined />, [
        getItem(<Link href="/admin/report/discussion">Thảo luận</Link>, '13'),
        getItem(<Link href="/admin/report/exam">Bài thi</Link>, '14'),
        getItem(<Link href="/admin/report/video">Video</Link>, '15')
    ]),
    getItem('Thảo luận', 'sub5', <CommentOutlined />, [
        getItem(<Link href="/admin/discussion">Tất cả bài viết</Link>, '16'),
        getItem(<Link href="/admin/topic">Tất cả chủ đề</Link>, '17'),
        getItem(<Link href="/admin/topic/create">Tạo chủ đề</Link>, '18')
    ]),
    getItem(
        <div className="relative">
            <Link href="/admin/notification">Thông báo</Link>
            <Chip color="primary" size="sm" className="absolute top-0 translate-y-[50%] right-0">
                10
            </Chip>
        </div>,
        '23',
        <BellOutlined />
    )
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
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

export default AdminLayout;
