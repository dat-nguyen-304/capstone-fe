import React, { Dispatch, SetStateAction } from 'react';
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

interface RegisterFormProps {
    role: ROLES;
    subjectIds: number[];
    combinationIds: number[];
    nextStep: () => void;
    backStep: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ role, subjectIds, combinationIds, backStep, nextStep }) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            fullName: '',
            password: '',
            confirmPassword: ''
        },
        resolver: yupResolver(registrationSchema)
    });

    const handleRegisterSubmit = async (values: any) => {
        try {
            if (role === ROLES.STUDENT) {
                await authApi.studentRegister({
                    userRegister: values,
                    combinationIds
                });
            } else if (role === ROLES.TEACHER) {
                await authApi.teacherRegister({
                    userRegister: values,
                    subjectIds
                });
            }
            nextStep();
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const animations = {
        div: {
            initial: {
                x: '-100%',
                opacity: 0
            },
            whileInView: {
                x: 0,
                opacity: 1
            }
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
                {...animations.div}
                className="border-gray-100 border-[2px] p-4 sm:p-8 rounded-3xl shadow-2xl shadow-gray-400"
            >
                <h2 className={`${styles.title} !text-center sm:!mb-8`}>Hoàn tất đăng ký</h2>

                <InputText label="Email" name="email" control={control} />
                <InputText label="Họ và tên" name="fullName" control={control} />
                <InputPassword label="Mật khẩu" name="password" control={control} />
                <InputPassword label="Nhập lại mật khẩu" name="confirmPassword" control={control} />

                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={backStep}
                        className="flex justify-center items-center w-[108px] h-[40px] sm:w-[200px] sm:h-[48px] text-xs sm:text-sm border-2 border-gray-300 rounded-full text-white uppercase font-semibold my-[10px] cursor-pointer"
                    >
                        <BsArrowLeft size={20} color="#333" className="w-[16px] sm:w-[20px]" />
                        <span className="ml-2 text-gray-600">Quay lại</span>
                    </button>
                    <button className="w-[108px] h-[40px] sm:w-[200px] sm:h-[48px] text-xs sm:text-sm bg-blue-500 border-none outline-none rounded-full text-white uppercase font-semibold my-[10px] cursor-pointer">
                        Đăng ký
                    </button>
                </div>
            </motion.div>
        </Form>
    );
};

export default RegisterForm;
