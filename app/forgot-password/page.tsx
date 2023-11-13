'use client';

import Image from 'next/image';
import styles from '@/app/auth/page.module.css';
import { AiOutlineUser } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordEmailSchema } from '@/yup_schema';
import { authApi } from '@/api-client';
import { useState } from 'react';

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: ''
        },
        resolver: yupResolver(forgotPasswordEmailSchema)
    });
    const sendForgotPasswordEmail = async (values: { email: string }) => {
        try {
            setIsLoading(true);
            const res = await authApi.forgotPassword(values.email);
            setIsLoading(false);
            setCheckEmail(true);
        } catch (error) {
            setIsLoading(false);
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.formsContainer}>
                <div className={`${styles.signinSignup} mt-[-240px] sm:mt-[-48px]`}>
                    {checkEmail ? (
                        <div className="flex flex-col items-center">
                            <h2 className="text-center mb-2 sm:mb-4 text-sm sm:text-2xl font-semibold text-blue-600">
                                Vui lòng kiểm tra email để đổi mật khẩu
                            </h2>
                            <Image src="/check-email.gif" width={300} height={200} alt="" />
                        </div>
                    ) : (
                        <form action="#" className={styles.signInForm} onSubmit={handleSubmit(sendForgotPasswordEmail)}>
                            <h2 className={styles.title}>Quên mật khẩu</h2>
                            <div className={styles.inputField}>
                                <i>
                                    <AiOutlineUser />
                                </i>
                                <input type="text" placeholder="Email" {...register('email')} />
                            </div>
                            <p className="text-xs sm:text-sm text-[#f31260]">{errors.email?.message}</p>
                            <div>
                                <Button
                                    isLoading={isLoading}
                                    type="submit"
                                    className={`${styles.btn} ${styles.solid} !w-[180px]`}
                                >
                                    Lấy lại mật khẩu
                                </Button>
                            </div>
                        </form>
                    )}
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
