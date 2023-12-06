'use client';

import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Drawer, Layout, Menu, theme } from 'antd';
import Image from 'next/image';
import Notification from '../notification/HeaderNotification';
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link } from '@nextui-org/react';
import { TbLogout, TbMenu2 } from 'react-icons/tb';
import { SafeUser } from '@/types';
import { useUser } from '@/hooks';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api-client';
import { useQueryClient } from '@tanstack/react-query';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

interface SidebarProps {
    user: SafeUser;
    items: MenuItem[];
    children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ user, items, children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const queryClient = useQueryClient();
    const currentUser = useUser();
    const router = useRouter();
    const {
        token: { colorBgContainer }
    } = theme.useToken();
    const handleLogout = async () => {
        await authApi.logout();
        queryClient.clear();
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
                    height: '95vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0
                }}
            >
                <Menu className="mt-14" theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
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
                <Header className="!bg-[#001529] flex h-[60px] justify-between items-center !px-[20px] lg:!px-[80px] fixed top-0 left-0 right-0 z-[999]">
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
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="secondary"
                                    name="Jason Hughes"
                                    size="sm"
                                    src={user.avatar as string}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="hello" className="h-14 gap-2">
                                    <p className="font-semibold">Xin chào</p>
                                    <p className="font-semibold">{user.fullName}</p>
                                </DropdownItem>
                                <DropdownItem
                                    className="text-black"
                                    as={Link}
                                    href={`${user.role === 'ADMIN' ? '/admin' : '/teacher'}/change-password`}
                                    key="change-password"
                                >
                                    Đổi mật khẩu
                                </DropdownItem>
                                <DropdownItem onClick={handleLogout} key="logout" color="danger">
                                    Đăng xuất
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="flex sm:hidden items-center justify-end">
                        <Notification />
                        <Button size="sm" variant="light" color="danger">
                            <TbLogout size={20} />
                        </Button>
                    </div>
                </Header>
                <Content className={collapsed ? 'sm:ml-[80px] transition-all' : 'sm:ml-[200px] transition-all '}>
                    <div className="p-1 sm:p-[24px] min-h-[84vh] mt-[60px] bg-white">{children}</div>
                </Content>
                <Footer className="header-bg">CEPA ©2023</Footer>
            </Layout>
        </Layout>
    );
};

export default Sidebar;
