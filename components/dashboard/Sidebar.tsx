'use client';
import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Drawer, Layout, Menu, theme } from 'antd';
import Image from 'next/image';
import Notification from '../header/Notification';
import { Button } from '@nextui-org/react';
import { TbLogout, TbMenu2 } from 'react-icons/tb';

const { Header, Content, Footer, Sider } = Layout;

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
    getItem('Bảng điều khiển', '1', <PieChartOutlined />),
    getItem('Cập nhật hồ sơ', '2', <UserOutlined />),
    getItem('Video', 'sub1', <DesktopOutlined />, [getItem('Đăng tải video mới', '3'), getItem('Video của tôi', '4')]),
    getItem('Khóa học', 'sub2', <TeamOutlined />, [getItem('Tạo khóa học', '5'), getItem('Khóa học của tôi', '6')]),
    getItem('Bài tập', 'sub3', <TeamOutlined />, [getItem('Tạo bài tập', '7'), getItem('Danh sách bài tập', '8')]),
    getItem('Thống kê', 'sub4', <TeamOutlined />, [
        getItem('Doanh thu', '9'),
        getItem('Khóa học & video', '10'),
        getItem('Người dùng', '11')
    ]),
    getItem('Giao dịch', '12', <FileOutlined />),
    getItem('Thông báo', '13', <PieChartOutlined />),
    getItem('Thảo luận', '14', <PieChartOutlined />)
];

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const {
        token: { colorBgContainer }
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                className="hidden sm:block"
                collapsible
                collapsed={collapsed}
                onCollapse={value => setCollapsed(value)}
            >
                <div className="flex flex-col items-center gap-4 my-4">
                    <Image
                        src="https://dienbientv.vn/dataimages/202203/original/images3128706_anh_chup_man_hinh_20220314_luc_182614_1647257194660_16472799737181193498662.png"
                        width={60}
                        height={60}
                        alt=""
                        className="cursor-pointer !rounded-full"
                    />
                    {!collapsed && <p className="text-white">Nguyễn Văn A</p>}
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Drawer
                placement={'left'}
                closable={false}
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
                key={'left'}
                width={240}
                className="drawer-dashboard-mobile"
            >
                <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Drawer>
            <Layout>
                <Header className="!bg-white flex h-[60px] justify-between items-center !px-[20px]">
                    <div className="flex gap-4 items-center">
                        <Button className="hidden sm:block bg-transparent" onClick={() => setCollapsed(!collapsed)}>
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </Button>
                        <div className="flex items-center gap-4">
                            <Image
                                src="https://intaadvising.gatech.edu/wp-content/uploads/2020/11/cepa.png"
                                width={45}
                                height={30}
                                alt=""
                                className="cursor-pointer"
                            />
                            <div onClick={() => setOpenDrawer(true)} className="block sm:hidden">
                                <TbMenu2 size={20} />
                            </div>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center justify-end h-[60px] sm:gap-[48px]">
                        <Notification />
                        <Button variant="light" color="danger">
                            <p className="flex gap-2">
                                Đăng xuất <TbLogout size={20} />
                            </p>
                        </Button>
                    </div>
                    <div className="flex sm:hidden items-center justify-end">
                        <Notification />
                        <Button size="sm" variant="light" color="danger">
                            <TbLogout size={20} />
                        </Button>
                    </div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>Bill is a cat.</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CEPA ©2023</Footer>
            </Layout>
        </Layout>
    );
};

export default App;
