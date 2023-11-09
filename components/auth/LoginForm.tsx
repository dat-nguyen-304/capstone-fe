import { Form } from 'antd';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import styles from '@/app/auth/page.module.css';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { authApi } from '@/api-client';
import { loginSchema } from '@/yup_schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks';
import { SafeUser } from '@/types';
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = ({}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const currentUser = useUser();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: yupResolver(loginSchema)
    });

    useEffect(() => {
        if (errors.email?.message) {
            setMessage(errors.email?.message as string);
        } else if (errors.password?.message) {
            setMessage(errors.password?.message as string);
        } else setMessage('');
    }, [errors]);

    const handleLoginSubmit = async (values: { email: string; password: string }) => {
        setIsLoading(true);
        setMessage('');
        try {
            const { email, password } = values;
            const res = await authApi.login({ email, password });
            console.log({ res });
            if (res.status === 200 && !res.data.code) {
                setMessage('');
                const userSession: SafeUser = res.data.userSession;
                console.log({ userSession });

                if (userSession.role === 'STUDENT') {
                    if (!userSession.avatar) userSession.avatar = '/student.png';
                    currentUser.onChangeUser(userSession);
                    setIsLoading(false);
                    return router.push('/');
                } else if (userSession.role === 'TEACHER') {
                    if (!userSession.avatar) userSession.avatar = '/teacher.png';
                    currentUser.onChangeUser(userSession);
                    setIsLoading(false);
                    return router.push('/teacher');
                } else if (userSession.role === 'ADMIN') {
                    if (!userSession.avatar) userSession.avatar = '/teacher.png';
                    currentUser.onChangeUser(userSession);
                    setIsLoading(false);
                    return router.push('/admin');
                }
            } else {
                setMessage('Tên đăng nhập hoặc mật khẩu không chính xác');
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setMessage('Vui lòng thử lại sau');
        }
    };

    const handleLoginWithGoogle = async (credentialResponse: CredentialResponse) => {
        setIsLoading(true);
        setMessage('');
        try {
            const res = await authApi.loginWithGoogle(credentialResponse.credential as string);
            console.log({ res });
            if (res.status === 200 && !res.data.code) {
                setMessage('');
                const userSession: SafeUser = res.data.userSession;
                console.log({ userSession });

                if (userSession.role === 'STUDENT') {
                    if (!userSession.avatar) userSession.avatar = '/student.png';
                    currentUser.onChangeUser(userSession);
                    setIsLoading(false);
                    return router.push('/');
                } else if (userSession.role === 'TEACHER') {
                    if (!userSession.avatar) userSession.avatar = '/teacher.png';
                    currentUser.onChangeUser(userSession);
                    setIsLoading(false);
                    return router.push('/teacher');
                } else if (userSession.role === 'ADMIN') {
                    if (!userSession.avatar) userSession.avatar = '/teacher.png';
                    currentUser.onChangeUser(userSession);
                    setIsLoading(false);
                    return router.push('/admin');
                }
            } else {
                setMessage('Vui lòng thử lại sau');
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setMessage('Vui lòng thử lại sau');
        }
    };

    return (
        <Form action="#" className={styles.signInForm} onFinish={handleSubmit(handleLoginSubmit)}>
            <h2 className={styles.title}>Đăng nhập</h2>
            <div className={styles.inputField}>
                <i>
                    <AiOutlineUser />
                </i>
                <input type="text" placeholder="Email" id="email" {...register('email')} />
            </div>
            <div className={styles.inputField}>
                <i>
                    <AiOutlineLock />
                </i>
                <input type="password" placeholder="Mật khẩu" id="current-password" {...register('password')} />
            </div>
            <p className="text-[#f31260]">{message}</p>
            <Form.Item className="!mb-0">
                <Button
                    isLoading={isLoading}
                    type="submit"
                    className="w-[150px] sm:w-[200px] bg-blue-500 border-none outline-none h-[50px] rounded-full text-white uppercase font-semibold my-[10px] cursor-pointer transition duration-500 hover:bg-[#4d84e2]"
                    id="login"
                >
                    Đăng nhập
                </Button>
            </Form.Item>
            <Link href="/forgot-password" className="" id="forgot-password">
                Quên mật khẩu
            </Link>
            <div className="border-t-2 mt-6 border-t-[#ccc] w-[300px] sm:w-[360px] flex justify-center">
                <div className="my-6">
                    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
                        <GoogleLogin
                            onSuccess={credentialResponse => handleLoginWithGoogle(credentialResponse)}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            theme="filled_blue"
                            size="large"
                            type="standard"
                            locale="vi_VN"
                            shape="pill"
                            logo_alignment="left"
                            text="signin_with"
                            useOneTap
                        />
                    </GoogleOAuthProvider>
                </div>
            </div>
        </Form>
    );
};

export default LoginForm;
