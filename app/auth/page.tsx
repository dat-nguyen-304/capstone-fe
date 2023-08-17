'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterRoot from '@/components/auth/RegisterRoot';

interface AuthPageProps {}

const AuthPage: React.FC<AuthPageProps> = ({}) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const changeForm = () => {
        setIsSignIn(!isSignIn);
    };

    return (
        <div className={isSignIn ? `${styles.container}` : `${styles.container} ${styles.signUpMode}`}>
            <div className={styles.formsContainer}>
                <div className={styles.signinSignup}>
                    <LoginForm />
                    <RegisterRoot />
                </div>
            </div>

            <div className={styles.panelsContainer}>
                <div className={`${styles.panel} ${styles.leftPanel}`}>
                    <div className={styles.content}>
                        <h3>New here ?</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis, ex ratione. Aliquid!</p>
                        <button className={`${styles.btn} ${styles.transparent}`} id="sign-up-btn" onClick={changeForm}>
                            Đăng ký
                        </button>
                    </div>
                    <Image src="/log.svg" className={styles.image} alt="" width={400} height={300} />
                </div>
                <div className={`${styles.panel} ${styles.rightPanel}`}>
                    <div className={styles.content}>
                        <h3>One of us ?</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum laboriosam ad deleniti.</p>
                        <button className={`${styles.btn} ${styles.transparent}`} id="sign-in-btn" onClick={changeForm}>
                            Đăng nhập
                        </button>
                    </div>
                    <Image src="/register.svg" className={styles.image} alt="" width={400} height={300} />
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
