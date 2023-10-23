'use client';

import { useUser } from '@/hooks';
import { NavbarContent, NavbarItem } from '@nextui-org/react';
import Link from 'next/link';

interface MenuItemsProps {}

const MenuItems: React.FC<MenuItemsProps> = () => {
    const { user } = useUser();
    let menuItems;
    menuItems = [
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
            name: 'Kiểm tra năng lực',
            link: '/check-level',
            isActive: false
        },
        {
            name: 'Thảo luận',
            link: '/discuss',
            isActive: false
        }
    ];
    if (user) {
        menuItems = [
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
                name: 'Kiểm tra năng lực',
                link: '/check-level',
                isActive: false
            },
            {
                name: 'Khóa học của tôi',
                link: '/my-courses',
                isActive: false
            },
            {
                name: 'Thảo luận',
                link: '/discuss',
                isActive: false
            }
        ];
    }
    return (
        <NavbarContent className="hidden md:flex gap-8" justify="center">
            {menuItems.map(item => (
                <NavbarItem key={item.link} isActive={item.isActive} className="font-medium text-sm">
                    <Link color="foreground" href={item.link}>
                        {item.name}
                    </Link>
                </NavbarItem>
            ))}
        </NavbarContent>
    );
};

export default MenuItems;
