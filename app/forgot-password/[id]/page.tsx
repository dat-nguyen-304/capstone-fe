'use client';

import Image from 'next/image';
import styles from '@/app/auth/page.module.css';
import { AiOutlineLock } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authApi } from '@/api-client';
import Loader from '@/components/Loader';
import NotFound from '@/app/not-found';
import { Button } from '@nextui-org/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { resetPasswordSchema } from '@/yup_schema';
import Link from 'next/link';

interface ForgotPasswordProps {
    params: { id: string };
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ params }) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        },
        resolver: yupResolver(resetPasswordSchema)
    });

    useEffect(() => {
        const confirmToken = async () => {
            try {
                const res = await authApi.confirm(params.id);
                if (!res.data.code) {
                    setIsValid(true);
                    setIsVerifying(false);
                } else {
                    setIsValid(false);
                    setIsVerifying(false);
                }
            } catch (error) {
                setIsVerifying(false);
                setIsValid(false);
            }
        };
        confirmToken();
    }, []);

    useEffect(() => {
        if (errors.password?.message) {
            setMessage(errors.password.message as string);
        } else if (errors.confirmPassword?.message) {
            setMessage(errors.confirmPassword.message as string);
        } else setMessage('');
    }, [errors]);

    const resetPassword = async (values: { password: string; confirmPassword: string }) => {
        try {
            setIsLoading(true);
            setMessage('');
            await authApi.resetPassword({
                uuid: params.id,
                password: values.password,
                confirmPassword: values.confirmPassword
            });
            setIsLoading(false);
            setIsSuccess(true);
        } catch (error) {
            setIsLoading(false);
            setMessage('Vui lòng thử lại sau');
        }
    };

    if (isSuccess)
        return (
            <div className="flex flex-col items-center">
                <h2 className="text-center mb-2 sm:mb-4 text-sm sm:text-2xl font-semibold text-blue-600">
                    Cập nhật mật khẩu thành công
                </h2>
                <Button as={Link} href="/auth" color="primary">
                    Đăng nhập ngay
                </Button>
            </div>
        );

    if (isVerifying) return <Loader />;
    else if (!isValid) return <NotFound />;
    else
        return (
            <div className={styles.container}>
                <div className={styles.formsContainer}>
                    <div className={`${styles.signinSignup} mt-[-200px] sm:mt-0`}>
                        <form action="#" className={styles.signInForm} onSubmit={handleSubmit(resetPassword)}>
                            <h2 className={styles.title}>Đặt lại mật khẩu</h2>
                            <div className={styles.inputField}>
                                <i>
                                    <AiOutlineLock />
                                </i>
                                <input type="password" placeholder="Nhập mật khẩu mới" {...register('password')} />
                            </div>
                            <div className={styles.inputField}>
                                <i>
                                    <AiOutlineLock />
                                </i>
                                <input
                                    type="password"
                                    placeholder="Xác nhận mật khẩu"
                                    {...register('confirmPassword')}
                                />
                            </div>
                            <p className="text-[#f31260]">{message}</p>
                            <Button isLoading={isLoading} type="submit" className={`${styles.btn} ${styles.solid}`}>
                                Xác nhận
                            </Button>
                        </form>
                    </div>
                </div>

                <div className={styles.panelsContainer}>
                    <div className={`${styles.panel} ${styles.leftPanel}`}>
                        <div className={styles.content}>
                            <h3>Bạn đã có tài khoản?</h3>
                            <p>Hãy đăng nhập ngay để bắt đầu cuộc hành trình chinh phục ước mơ nào</p>
                            <button
                                className="w-[110px] sm:w-[130px] bg-none border-solid border-[2px] border-white outline-none h-[35px] sm:h-[40px] rounded-full text-white uppercase font-medium text-xs sm:text-sm m-0 cursor-pointer"
                                id="sign-up-btn"
                                onClick={() => router.push('/auth', { scroll: false })}
                            >
                                Đăng nhập
                            </button>
                        </div>
                        <Image src="/log.svg" className={styles.image} alt="" width={400} height={300} />
                    </div>
                </div>
            </div>
        );
};

export default ForgotPassword;
