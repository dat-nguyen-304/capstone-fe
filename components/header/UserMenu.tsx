'use client';

import { CommonUser } from '@/types';
import { Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import { useUser } from '@/hooks';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api-client';
interface UserMenuProps {
    currentUser: CommonUser;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const { onChangeUser } = useUser();
    const router = useRouter();
    const handleLogout = async () => {
        await authApi.logout({ email: currentUser.email });
        onChangeUser(null);
        router.push('/');
    };

    console.log('currentUser.role', currentUser.role);
    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    name="Jason Hughes"
                    size="sm"
                    src={currentUser.avatar}
                />
            </DropdownTrigger>
            {currentUser.role === 'STUDENT' ? (
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="hello" className="h-14 gap-2">
                        <p className="font-semibold">Xin chào</p>
                        <p className="font-semibold">{currentUser.fullName}</p>
                    </DropdownItem>
                    <DropdownItem as={Link} href="/edit-profile" key="profile">
                        Chỉnh sửa hồ sơ
                    </DropdownItem>
                    <DropdownItem as={Link} href="/transaction" key="transaction">
                        Lịch sử giao dịch
                    </DropdownItem>
                    <DropdownItem as={Link} href="/change-password" key="change-password">
                        Đổi mật khẩu
                    </DropdownItem>
                    <DropdownItem onClick={handleLogout} key="logout" color="danger">
                        Đăng xuất
                    </DropdownItem>
                </DropdownMenu>
            ) : (
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="hello" className="h-14 gap-2">
                        <p className="font-semibold">Xin chào</p>
                        <p className="font-semibold">{currentUser.fullName}</p>
                    </DropdownItem>
                    <DropdownItem as={Link} href={`/${currentUser.role.toLocaleLowerCase()}`} key="profile">
                        Bảng điều khiển
                    </DropdownItem>
                    <DropdownItem onClick={handleLogout} key="logout" color="danger">
                        Đăng xuất
                    </DropdownItem>
                </DropdownMenu>
            )}
        </Dropdown>
    );
};

export default UserMenu;
