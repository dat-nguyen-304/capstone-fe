'use client';

import NotFound from '@/app/not-found';
import { useReportModal, useUser } from '@/hooks';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { ReportModal } from '../modal';
import Loader from '../Loader';
import { handleUserReload } from '@/utils/handleUserReload';
import { SafeUser } from '@/types';
import { useEffect, useState } from 'react';

interface DoTestHeaderProps {
    type: 'quiz' | 'exam';
    id: number;
    children: React.ReactNode;
}

const DoTestHeader: React.FC<DoTestHeaderProps> = ({ type, id, children }) => {
    const currentUser = useUser();
    const [user, setUser] = useState<SafeUser | null>(currentUser.user);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { isOpen, onOpen, onClose, onContentType, onReportType, onDescription, onFile } = useReportModal();

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

    const openReportModal = () => {
        onContentType('discussion');
        onOpen();
    };

    if (isLoading) return <Loader />;

    if (user?.role !== 'STUDENT') return <NotFound />;

    return (
        <>
            <div className="h-[60px] z-10 fixed left-0 right-0 top-0 bg-blue-400 flex items-center justify-between px-2 sm:px-8 text-white">
                <div className="flex items-center gap-4">
                    <Image
                        src="https://intaadvising.gatech.edu/wp-content/uploads/2020/11/cepa.png"
                        width={60}
                        height={60}
                        alt=""
                        className="hidden sm:block"
                    />
                    <span className="text-sm max-w-[120px] sm:max-w-[300px] xl:max-w-[600px] truncate">
                        Bài kiểm tra
                    </span>
                </div>
                <div className="">
                    <Button size="sm" className="mr-4" color="danger" variant="solid" onClick={openReportModal}>
                        Báo cáo
                    </Button>
                    <Button as={Link} href={type === 'quiz' ? `/quiz/${id}` : `/exam/${id}`} size="sm">
                        Thoát
                    </Button>
                </div>
                <ReportModal />
            </div>
            {children}
        </>
    );
};

export default DoTestHeader;
