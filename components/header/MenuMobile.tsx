'use client';

import { useUser } from '@/hooks';
import { Link, NavbarMenu, NavbarMenuItem } from '@nextui-org/react';

interface MenuMobileProps {}

const MenuMobile: React.FC<MenuMobileProps> = () => {
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
            link: '/course',
            isActive: false
        },
        {
            name: 'Kiểm tra năng lực',
            link: '/check-level',
            isActive: false
        },
        {
            name: 'Luyện đề',
            link: '/exam',
            isActive: false
        },
        {
            name: 'Thảo luận',
            link: '/discussion',
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
                link: '/course',
                isActive: false
            },
            {
                name: 'Khóa học của tôi',
                link: '/my-course',
                isActive: false
            },
            {
                name: 'Kiểm tra năng lực',
                link: '/check-level',
                isActive: false
            },
            {
                name: 'Luyện đề ngay',
                link: '/exam',
                isActive: false
            },
            {
                name: 'Lịch sử luyện đề',
                link: '/exam-history',
                isActive: false
            },
            {
                name: 'Tất cả bài đăng',
                link: '/discussion',
                isActive: false
            },
            {
                name: 'Đăng bài mới',
                link: '/create-post',
                isActive: false
            }
        ];
    }
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
