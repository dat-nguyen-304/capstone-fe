import React, { Dispatch, SetStateAction } from 'react';
import { Button, Form } from 'antd';
import styles from '@/app/auth/page.module.css';
import { Subject } from '@/types';
import { motion } from 'framer-motion';
import { InputPassword, InputText } from '@/components/form-input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registrationSchema } from '@/yup_schema';

interface RegisterFormProps {
    role: string;
    setRole: Dispatch<SetStateAction<string>>;
    subjects: Subject[];
    setIsFillForm: Dispatch<SetStateAction<boolean>>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ role, setRole, subjects, setIsFillForm }) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            username: '',
            name: '',
            password: '',
            confirmPassword: ''
        },
        resolver: yupResolver(registrationSchema)
    });

    const animations = {
        div: {
            initial: {
                opacity: 0
            },
            whileInView: {
                opacity: 1
            }
        }
    };

    const handleRegisterSubmit = (values: any) => {
        console.log(values);
    };

    return (
        <Form
            labelCol={{ span: 10 }}
            labelAlign="left"
            labelWrap={true}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            size="middle"
            className={`${styles.signUpForm} !block !overflow-visible`}
            onFinish={handleSubmit(handleRegisterSubmit)}
        >
            <motion.div
                {...animations.div}
                className="border-gray-100 border-[2px] p-4 sm:p-8 rounded-3xl shadow-2xl shadow-gray-400"
            >
                <h2 className={`${styles.title} !text-center sm:!mb-8`}>Hoàn tất đăng ký</h2>

                <InputText label="Tên đăng nhập" name="username" control={control} />
                <InputText label="Họ và tên" name="name" control={control} />
                <InputPassword label="Mật khẩu" name="password" control={control} />
                <InputPassword label="Mật khẩu" name="confirmPassword" control={control} />

                <Form.Item className="flex justify-center !mb-0">
                    <Button htmlType="submit" className={`${styles.btn} ${styles.solid}`}>
                        Đăng ký
                    </Button>
                </Form.Item>
            </motion.div>
        </Form>
    );
};

export default RegisterForm;
