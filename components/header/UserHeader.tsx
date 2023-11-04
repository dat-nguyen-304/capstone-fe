'use client';

import { SafeUser, Student } from '@/types';
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
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <Logo isMenuOpen={isMenuOpen} />

            <MenuItems />

            {user ? <UserItems currentStudent={user as Student} /> : <StartNow />}

            <MenuMobile />
        </Navbar>
    );
};

export default Header;
