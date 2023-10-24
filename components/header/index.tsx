'use client';

import { SafeUser, Student } from '@/types';
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
    const currentUser = useUser();
    const [user, setUser] = useState<SafeUser | null>(currentUser.user);

    useEffect(() => {
        //     if (!user) {
        //         console.log('start');
        handleUserReload(currentUser.onChangeUser);
        //     console.log('end');
        //     setUser(currentUser.user);
        // }
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
