'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Active: React.FC = () => {
    const [count, setCount] = useState(5);
    const router = useRouter();
    useEffect(() => {
        if (count === 0) {
            router.push('/auth', { scroll: false });
        } else
            setTimeout(() => {
                setCount(count - 1);
            }, 1000);
    }, [count]);
    return (
        <div className="flex items-center justify-center flex-col bg-cyan-50 h-[100vh]">
            <div>
                <h2 className="text-center text-xl sm:text-3xl">Kích hoạt tài khoản thành công</h2>
                <p className="mt-2 text-center text-xs">Đang chuyển trang đăng nhập. Vui lòng chờ ({count}) s</p>
            </div>
            <Image src="/approved-folder.png" alt="" width={500} height={500} className="mt-12" />
        </div>
    );
};

export default Active;
