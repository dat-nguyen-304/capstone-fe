'use client';

import { Student } from '@/types';
import { Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import { useUser } from '@/hooks';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api-client';
interface UserMenuProps {
    currentStudent: Student;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentStudent }) => {
    const currentUser = useUser();
    const router = useRouter();
    const handleLogout = async () => {
        await authApi.logout({ email: currentUser.user?.email as string });
        currentUser.onChangeUser(null);
        router.push('/');
    };

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
                    src={currentStudent.avatar}
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="hello" className="h-14 gap-2">
                    <p className="font-semibold">Xin chào</p>
                    <p className="font-semibold">{currentStudent.fullName}</p>
                </DropdownItem>
                <DropdownItem as={Link} href="/profile" key="profile">
                    Hồ sơ
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
        </Dropdown>
    );
};

export default UserMenu;
