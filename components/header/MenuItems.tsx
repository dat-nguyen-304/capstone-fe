'use client';

import { useUser } from '@/hooks';
import { NavbarContent, NavbarItem } from '@nextui-org/react';
import Link from 'next/link';
import { BsChevronDown } from 'react-icons/bs';

interface MenuItemsProps {}

const MenuItems: React.FC<MenuItemsProps> = () => {
    const { user } = useUser();
    let content;
    if (user?.role === 'STUDENT') {
        content = (
            <NavbarContent className="hidden md:flex gap-8 text-left" justify="center">
                <NavbarItem key="homepage" isActive={true} className="font-medium text-sm">
                    <Link color="foreground" href="/">
                        Trang chủ
                    </Link>
                </NavbarItem>
                <NavbarItem key="course" isActive={true} className="font-medium text-sm">
                    <div className="relative group z-50">
                        <div className="cursor-pointer flex items-center">
                            <span>Khóa học </span>
                            <BsChevronDown className="mt-1 ml-1 font-semibold" />
                        </div>
                        <div className="group-hover:block mt-1 absolute left-[-30%] hidden border-2 border-gray-100 shadow-xl text-white p-2 rounded-xl bg-white after:absolute after:block after:top-[-8px] after:left-0 after:h-[10px] after:w-full">
                            <Link
                                href="/course"
                                className="text-black block px-4 py-2 hover:bg-blue-100 rounded-lg my-1"
                            >
                                Tất cả khóa học
                            </Link>
                            <Link
                                href="/my-course"
                                className="text-black block px-4 py-2 hover:bg-blue-100 rounded-lg my-1"
                            >
                                Khóa học của tôi
                            </Link>
                        </div>
                    </div>
                </NavbarItem>
                <NavbarItem key="suggestion" isActive={false} className="font-medium text-sm">
                    <Link color="foreground" href="/suggestion">
                        Gợi ý khóa học
                    </Link>
                </NavbarItem>
                <NavbarItem key="practice" isActive={true} className="font-medium text-sm">
                    <div className="relative group z-50">
                        <div className="cursor-pointer flex items-center">
                            <span>Luyện đề</span>
                            <BsChevronDown className="mt-1 ml-1 font-semibold" />
                        </div>
                        <div className="group-hover:block mt-1 absolute left-[-30%] hidden border-2 border-gray-100 shadow-xl text-white p-2 rounded-xl bg-white after:absolute after:block after:top-[-8px] after:left-0 after:h-[10px] after:w-full">
                            <Link href="/exam" className="text-black block px-4 py-2 hover:bg-blue-100 rounded-lg my-1">
                                Luyện đề ngay
                            </Link>
                            <Link
                                href="/exam/history"
                                className="text-black block px-4 py-2 hover:bg-blue-100 rounded-lg my-1"
                            >
                                Lịch sử luyện đề
                            </Link>
                        </div>
                    </div>
                </NavbarItem>
                <NavbarItem key="discussion" isActive={true} className="font-medium text-sm">
                    <div className="relative group z-50">
                        <div className="cursor-pointer flex items-center">
                            <span>Thảo luận</span>
                            <BsChevronDown className="mt-1 ml-1 font-semibold" />
                        </div>
                        <div className="group-hover:block mt-1 absolute left-[-30%] hidden border-2 border-gray-100 shadow-xl text-white p-2 rounded-xl bg-white after:absolute after:block after:top-[-8px] after:left-0 after:h-[10px] after:w-full">
                            <Link
                                href="/discussion"
                                className="text-black block px-4 py-2 hover:bg-blue-100 rounded-lg my-1"
                            >
                                Tất cả bài đăng
                            </Link>
                            <Link
                                href="/discussion/create/post"
                                className="text-black block px-4 py-2 hover:bg-blue-100 rounded-lg my-1"
                            >
                                Đăng bài mới
                            </Link>
                            <Link
                                href="/discussion/my-post"
                                className="text-black block px-4 py-2 hover:bg-blue-100 rounded-lg my-1"
                            >
                                Bài đăng của tôi
                            </Link>
                        </div>
                    </div>
                </NavbarItem>
            </NavbarContent>
        );
    } else if (!user?.role) {
        content = (
            <NavbarContent className="hidden md:flex gap-8" justify="center">
                <NavbarItem key="homepage" isActive={true} className="font-medium text-sm">
                    <Link color="foreground" href="/">
                        Trang chủ
                    </Link>
                </NavbarItem>
                <NavbarItem key="course" isActive={false} className="font-medium text-sm">
                    <Link color="foreground" href="/course">
                        Khóa học
                    </Link>
                </NavbarItem>
                <NavbarItem key="suggestion" isActive={false} className="font-medium text-sm">
                    <Link color="foreground" href="/suggestion">
                        Gợi ý khóa học
                    </Link>
                </NavbarItem>
                <NavbarItem key="exam" isActive={false} className="font-medium text-sm">
                    <Link color="foreground" href="/exam">
                        Luyện đề
                    </Link>
                </NavbarItem>
                <NavbarItem key="discussion" isActive={false} className="font-medium text-sm">
                    <Link color="foreground" href="/discussion">
                        Thảo luận
                    </Link>
                </NavbarItem>
            </NavbarContent>
        );
    } else {
        content = (
            <NavbarContent className="hidden md:flex gap-8" justify="center">
                <NavbarItem key="homepage" isActive={true} className="font-medium text-sm">
                    <Link color="foreground" href="/">
                        Trang chủ
                    </Link>
                </NavbarItem>
                <NavbarItem key="course" isActive={false} className="font-medium text-sm">
                    <Link color="foreground" href="/course">
                        Khóa học
                    </Link>
                </NavbarItem>
            </NavbarContent>
        );
    }
    return content;
};

export default MenuItems;
