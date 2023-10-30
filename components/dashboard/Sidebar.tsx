'use client';

import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Drawer, Layout, Menu, theme } from 'antd';
import Image from 'next/image';
import Notification from '../header/Notification';
import { Button } from '@nextui-org/react';
import { TbLogout, TbMenu2 } from 'react-icons/tb';
import { User } from '@/types';
import { useUser } from '@/hooks';
import { useRouter } from 'next/navigation';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

interface SidebarProps {
    user: User;
    items: MenuItem[];
    children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ user, items, children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const currentUser = useUser();
    const router = useRouter();
    const {
        token: { colorBgContainer }
    } = theme.useToken();
    const handleLogout = () => {
        currentUser.onChangeUser(null);
        router.push('/auth');
    };

    return (
        <Layout style={{ minHeight: '100vh' }} className="relative">
            <Sider
                className="hidden sm:block"
                collapsible
                collapsed={collapsed}
                onCollapse={value => setCollapsed(value)}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0
                }}
            >
                <div className="flex flex-col items-center gap-4 mb-4 mt-20">
                    <Image src={user.avatar} width={60} height={60} alt="" className="cursor-pointer !rounded-full" />
                    {!collapsed && <p className="text-white">{user.fullName}</p>}
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
                <Header className="!bg-[#001529] flex h-[60px] justify-between items-center !px-[20px] fixed top-0 left-0 right-0 z-[999]">
                    <div className="flex gap-4 items-center">
                        <Image
                            src="https://intaadvising.gatech.edu/wp-content/uploads/2020/11/cepa.png"
                            width={45}
                            height={30}
                            alt=""
                            className="cursor-pointer"
                        />
                        <div onClick={() => setOpenDrawer(true)} className="block sm:hidden">
                            <TbMenu2 size={20} className="text-white" />
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center justify-end h-[60px] sm:gap-[48px]">
                        <Notification />
                        <Button variant="light" color="danger" onClick={handleLogout}>
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
                <Content className={collapsed ? 'sm:ml-[80px] transition-all' : 'sm:ml-[200px] transition-all '}>
                    <div className="p-1 sm:p-[24px] min-h-[360px] mt-[60px]" style={{ background: colorBgContainer }}>
                        {children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CEPA ©2023</Footer>
            </Layout>
        </Layout>
    );
};

export default Sidebar;
