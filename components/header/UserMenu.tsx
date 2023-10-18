'use client';

import { Student } from '@/types';
import { Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';

interface UserMenuProps {
    currentUser: Student;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
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
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Xin chào</p>
                    <p className="font-semibold">{currentUser.email}</p>
                </DropdownItem>
                <DropdownItem as={Link} href="/profile" key="profile">
                    Hồ sơ
                </DropdownItem>
                <DropdownItem as={Link} href="/transaction" key="transaction">
                    Lịch sử giao dịch
                </DropdownItem>
                <DropdownItem as={Link} href="/logout" key="logout" color="danger">
                    Đăng xuất
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default UserMenu;
