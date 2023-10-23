'use client';

import { Link, NavbarMenu, NavbarMenuItem } from '@nextui-org/react';

interface MenuMobileProps {}

const MenuMobile: React.FC<MenuMobileProps> = () => {
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
    return (
        <NavbarMenu>
            {menuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`} className="my-4">
                    <Link className="w-full" color="foreground" href={item.link} size="lg">
                        {item.name}
                    </Link>
                </NavbarMenuItem>
            ))}
        </NavbarMenu>
    );
};

export default MenuMobile;
