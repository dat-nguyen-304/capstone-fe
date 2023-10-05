'use client';

import { NavbarContent, NavbarItem } from '@nextui-org/react';
import Link from 'next/link';

interface MenuItemsProps {}

const MenuItems: React.FC<MenuItemsProps> = () => {
    const menuItems = [
        {
            name: 'Trang chủ',
            link: '/',
            isActive: true
        },
        {
            name: 'Khóa học',
            link: '/courses',
            isActive: false
        },
        {
            name: 'Kiểm tra đầu vào',
            link: '/test',
            isActive: false
        },
        {
            name: 'Khóa học của tôi',
            link: '/my-course',
            isActive: false
        },
        {
            name: 'Diễn đàn',
            link: '/forum',
            isActive: false
        }
    ];
    return (
        <NavbarContent className="hidden sm:flex gap-8" justify="center">
            {menuItems.map(item => (
                <NavbarItem key={item.link} isActive={item.isActive} className="font-medium text-sm">
                    <Link color="foreground" href="#">
                        {item.name}
                    </Link>
                </NavbarItem>
            ))}
        </NavbarContent>
    );
};

export default MenuItems;
