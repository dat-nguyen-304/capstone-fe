'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authApi } from '@/api-client';
import Loader from '@/components/Loader';
import NotFound from '@/app/not-found';

interface ActiveProps {
    params: { id: string };
}

const Active: React.FC<ActiveProps> = ({ params }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isActivated, setIsActivated] = useState<boolean>(false);
    const [count, setCount] = useState(5);
    const router = useRouter();

    useEffect(() => {
        const confirmRegister = async () => {
            try {
                const res = await authApi.confirm(params.id);
                if (!res.data.code) {
                    setIsLoading(false);
                    setIsActivated(true);
                } else {
                    setIsLoading(false);
                    setIsActivated(false);
                }
            } catch (error) {
                setIsLoading(false);
                setIsActivated(false);
            }
        };
        confirmRegister();
    }, []);

    useEffect(() => {
        if (!isLoading && isActivated) {
            if (count === 0) {
                router.push('/auth', { scroll: false });
            } else
                setTimeout(() => {
                    setCount(count - 1);
                }, 1000);
        }
    }, [isLoading, count]);

    let currentPage;
    if (isLoading) currentPage = <Loader />;
    else if (isActivated) {
        currentPage = (
            <div className="flex items-center justify-center flex-col h-[100vh]">
                <div>
                    <h2 className="text-center text-xl sm:text-3xl">Kích hoạt tài khoản thành công</h2>
                    <p className="mt-2 text-center text-xs">Đang chuyển trang đăng nhập. Vui lòng chờ ({count}) s</p>
                </div>
                <Image src="/approved-folder.png" alt="" width={500} height={500} className="mt-12" />
            </div>
        );
    } else {
        currentPage = <NotFound />;
    }
    return currentPage;
};

export default Active;
