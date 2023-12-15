'use client';

import { NavbarBrand, NavbarContent, NavbarMenuToggle } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LogoProps {
    isMenuOpen: boolean;
}

const Logo: React.FC<LogoProps> = ({ isMenuOpen }) => {
    const router = useRouter();

    return (
        <NavbarContent justify="center">
            <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="md:hidden" />
            <NavbarBrand>
                <Link href="/" aria-label="Go home" title="Company" className="inline-flex items-center">
                    <Image
                        onClick={() => router.push('/')}
                        src="/logo.png"
                        width={96}
                        height={183}
                        alt=""
                        className="cursor-pointer w-5 h-10"
                    />
                    <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">CEPA</span>
                </Link>
            </NavbarBrand>
        </NavbarContent>
    );
};

export default Logo;
