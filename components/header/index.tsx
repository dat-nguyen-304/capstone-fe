'use client';

import { Student } from '@/types';
import { Navbar } from '@nextui-org/react';
import { useState } from 'react';
import Logo from './Logo';
import MenuItems from './MenuItems';
import SignInSignUp from './SignInSignUp';
import MenuMobile from './MenuMobile';
import UserItems from './UserItems';
interface HeaderProps {
    currentUser: null | Student;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <Logo isMenuOpen={isMenuOpen} />

            <MenuItems />

            {currentUser ? <UserItems currentUser={currentUser} /> : <SignInSignUp />}

            <MenuMobile />
        </Navbar>
    );
};

export default Header;
