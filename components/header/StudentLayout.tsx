'use client';

import { useUser } from '@/hooks';
import { SafeUser } from '@/types';
import { useEffect, useState } from 'react';
import UserHeader from './UserHeader';
import Footer from '../footer';
import { handleUserReload } from '@/utils/handleUserReload';
import Loader from '../Loader';

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
    const currentUser = useUser();
    const [user, setUser] = useState<SafeUser | null>(currentUser.user);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const handleReload = async () => {
            if (!currentUser.user && user) {
                setUser(null);
                setIsLoading(false);
            } else if (!currentUser.user) {
                try {
                    setIsLoading(true);
                    const userSession = await handleUserReload();
                    if (userSession) currentUser.onChangeUser(userSession as SafeUser);
                    setUser(userSession);
                    setIsLoading(false);
                } catch (error) {
                    currentUser.onChangeUser(null);
                    setUser(null);
                    setIsLoading(false);
                }
            } else setIsLoading(false);
        };
        handleReload();
    }, [currentUser.user]);

    if (isLoading) return <Loader />;

    return (
        <>
            <UserHeader user={user} />
            <div className="min-h-[50vh]">{children}</div>
            <Footer />
        </>
    );
};

export default StudentLayout;
