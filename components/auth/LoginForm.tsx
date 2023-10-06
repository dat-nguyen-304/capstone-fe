import { Form } from 'antd';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import styles from '@/app/auth/page.module.css';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = ({}) => {
    return (
        <Form action="#" className={styles.signInForm}>
            <h2 className={styles.title}>Đăng nhập</h2>
            <div className={styles.inputField}>
                <i>
                    <AiOutlineUser />
                </i>
                <input type="text" placeholder="Email" />
            </div>
            <div className={styles.inputField}>
                <i>
                    <AiOutlineLock />
                </i>
                <input type="password" placeholder="Mật khẩu" />
            </div>
            <Form.Item className="!mb-0">
                <Button
                    type="submit"
                    className="w-[150px] sm:w-[200px] bg-blue-500 border-none outline-none h-[50px] rounded-full text-white uppercase font-semibold my-[10px] cursor-pointer transition duration-500 hover:bg-[#4d84e2]"
                >
                    Đăng nhập
                </Button>
            </Form.Item>
            <Link href="/forgot-password" className="">
                Quên mật khẩu
            </Link>
            <div className="border-t-2 mt-6 border-t-[#ccc] w-[300px] sm:w-[360px] flex justify-center">
                <Button
                    className="mt-6 bg-white border-[2px] border-black flex w-[280px] sm:w-[320px] text-base px-8 py-6 font-semibold text-[#333]"
                    startContent={<FcGoogle size={24} />}
                >
                    <p className="flex-1">Đăng nhập với google</p>
                </Button>
            </div>
        </Form>
    );
};

export default LoginForm;
