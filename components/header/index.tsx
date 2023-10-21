'use client';

import { Student } from '@/types';
import { Navbar } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import MenuItems from './MenuItems';
import SignInSignUp from './SignInSignUp';
import MenuMobile from './MenuMobile';
import UserItems from './UserItems';
import { useUser } from '@/hooks';
import { handleUserReload } from '@/utils/handleUserReload';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, onChangeUser } = useUser();

    useEffect(() => {
        if (!user) {
            handleUserReload(onChangeUser);
        }
    }, []);

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <Logo isMenuOpen={isMenuOpen} />

            <MenuItems />

            {user ? <UserItems currentStudent={user as Student} /> : <SignInSignUp />}

            <MenuMobile />
        </Navbar>
    );
};

export default Header;
