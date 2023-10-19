import { Form } from 'antd';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import styles from '@/app/auth/page.module.css';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { authApi } from '@/api-client';
import { loginSchema } from '@/yup_schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import useUser from '@/hooks/useUser';
import { SafeUser } from '@/types';

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
        }
    }, [errors]);

    const handleLoginSubmit = async (values: { email: string; password: string }) => {
        setIsLoading(true);
        try {
            const { email, password } = values;
            const res = await authApi.login({ email, password });
            if (res.status === 200 && !res.data.errCode) {
                setMessage('');

                const userSession: SafeUser = res.data.userSession;
                currentUser.onChangeUser(userSession);

                if (userSession.role === 'STUDENT') {
                    if (!userSession.avatar) userSession.avatar = '/student.png';
                    setIsLoading(false);
                    return router.push('/');
                } else if (userSession.role === 'TEACHER') {
                    if (!userSession.avatar) userSession.avatar = '/teacher.png';
                    setIsLoading(false);
                    return router.push('/teacher');
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
                <Button
                    className="mt-6 bg-white border-[2px] border-black flex w-[280px] sm:w-[320px] text-base px-8 py-6 font-semibold text-[#333]"
                    id="google-login"
                    startContent={<FcGoogle size={24} />}
                >
                    <p className="flex-1">Đăng nhập với google</p>
                </Button>
            </div>
        </Form>
    );
};

export default LoginForm;
