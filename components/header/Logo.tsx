'use client';

import { NavbarBrand, NavbarContent, NavbarMenuToggle } from '@nextui-org/react';
import Image from 'next/image';
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
                <Image
                    onClick={() => router.push('/')}
                    src="https://intaadvising.gatech.edu/wp-content/uploads/2020/11/cepa.png"
                    width={80}
                    height={80}
                    alt=""
                    className="cursor-pointer"
                />
            </NavbarBrand>
        </NavbarContent>
    );
};

export default Logo;
