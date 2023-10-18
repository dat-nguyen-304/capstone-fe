import React, { useState } from 'react';
import { Form } from 'antd';
import styles from '@/app/auth/page.module.css';
import { motion } from 'framer-motion';
import { InputPassword, InputText } from '@/components/form-input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registrationSchema } from '@/yup_schema';
import { BsArrowLeft } from 'react-icons/bs';
import { authApi } from '@/api-client/auth-api';
import { ROLES } from './RegisterRoot';
import { Button } from '@nextui-org/react';
import { horizontal } from '@/animations';

interface RegisterFormProps {
    role: ROLES;
    subjectIds: number[];
    combinationIds: number[];
    nextStep: () => void;
    backStep: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ role, subjectIds, combinationIds, backStep, nextStep }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            email: '',
            fullName: '',
            password: '',
            confirmPassword: ''
        },
        resolver: yupResolver(registrationSchema)
    });

    const handleRegisterSubmit = async (values: any) => {
        setIsLoading(true);
        try {
            let res;
            if (role === ROLES.STUDENT) {
                res = await authApi.studentRegister({
                    userRegister: values,
                    combinationIds
                });
            } else {
                res = await authApi.teacherRegister({
                    userRegister: values,
                    subjectIds
                });
            }
            setIsLoading(false);
            if (res.status === 201) {
                nextStep();
            } else if (res.data?.message === '1') {
                setError('email', {
                    type: 'manual',
                    message: 'Email đã tồn tại'
                });
            }
        } catch (error: any) {
            setIsLoading(false);
            console.log(error.message);
        }
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
                {...horizontal(50, 0.3, 0)}
                className="border-gray-100 border-[2px] p-4 sm:p-8 rounded-3xl shadow-2xl shadow-gray-400"
            >
                <h2 className={`${styles.title} !text-center sm:!mb-8`}>Hoàn tất đăng ký</h2>

                <InputText size="sm" label="Email" name="email" control={control} />
                <InputText size="sm" label="Họ và tên" name="fullName" control={control} />
                <InputPassword size="sm" label="Mật khẩu" name="password" control={control} />
                <InputPassword size="sm" label="Nhập lại mật khẩu" name="confirmPassword" control={control} />

                <div className="flex justify-center items-center gap-4">
                    <Button
                        onClick={!isLoading ? backStep : () => {}}
                        className="flex justify-center items-center bg-white w-[108px] h-[40px] sm:w-[200px] sm:h-[48px] text-xs sm:text-sm border-2 border-gray-300 rounded-full uppercase font-semibold my-[10px] cursor-pointer"
                    >
                        <BsArrowLeft size={20} color="#333" className="w-[16px] sm:w-[20px]" />
                        <span className="ml-2 text-gray-600">Quay lại</span>
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-[108px] h-[40px] sm:w-[200px] sm:h-[48px] text-xs sm:text-sm bg-blue-500 border-none outline-none rounded-full text-white uppercase font-semibold my-[10px] cursor-pointer"
                    >
                        Đăng ký
                    </Button>
                </div>
            </motion.div>
        </Form>
    );
};

export default RegisterForm;
