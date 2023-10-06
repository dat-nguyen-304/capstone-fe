'use client';

import Image from 'next/image';
import styles from '@/app/auth/page.module.css';
import { Form } from 'antd';
import { AiOutlineUser } from 'react-icons/ai';
import { useRouter } from 'next/navigation';

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <div className={styles.formsContainer}>
                <div className={`${styles.signinSignup} mt-[-240px] sm:mt-0`}>
                    <Form action="#" className={styles.signInForm}>
                        <h2 className={styles.title}>Quên mật khẩu</h2>
                        <div className={styles.inputField}>
                            <i>
                                <AiOutlineUser />
                            </i>
                            <input type="text" placeholder="Email" />
                        </div>
                        <Form.Item>
                            <button type="submit" className={`${styles.btn} ${styles.solid} !w-[180px]`}>
                                Lấy lại mật khẩu
                            </button>
                        </Form.Item>
                    </Form>
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
