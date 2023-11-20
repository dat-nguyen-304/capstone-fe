'use client';

import { CommonUser, SafeUser } from '@/types';
import { Navbar } from '@nextui-org/react';
import { useState } from 'react';
import Logo from './Logo';
import MenuItems from './MenuItems';
import StartNow from './StartNow';
import MenuMobile from './MenuMobile';
import UserItems from './UserItems';

interface HeaderProps {
    user: SafeUser | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar className="shadow-sm header-bg bg-white shadow-md" onMenuOpenChange={setIsMenuOpen}>
            <Logo isMenuOpen={isMenuOpen} />

            <MenuItems />

            {user ? <UserItems currentUser={user as CommonUser} /> : <StartNow />}

            <MenuMobile />
        </Navbar>
    );
};

export default Header;
