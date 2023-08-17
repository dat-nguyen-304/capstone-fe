import React, { Dispatch, SetStateAction } from 'react';
import { Button, Form, Input } from 'antd';
import styles from '@/app/auth/page.module.css';
import { Subject } from '@/types';
import { motion } from 'framer-motion';

interface RegisterFormProps {
    role: string;
    setRole: Dispatch<SetStateAction<string>>;
    subjects: Subject[];
    setIsFillForm: Dispatch<SetStateAction<boolean>>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ role, setRole, subjects, setIsFillForm }) => {
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

    return (
        <Form
            labelCol={{ span: 10 }}
            labelAlign="left"
            labelWrap={true}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            size="middle"
            className={`${styles.signUpForm} !block !overflow-visible`}
        >
            <motion.div
                {...animations.div}
                className="border-gray-100 border-[2px] p-4 sm:p-8 rounded-3xl shadow-2xl shadow-gray-400"
            >
                <h2 className={`${styles.title} !text-center sm:!mb-8`}>Hoàn tất đăng ký</h2>

                <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Họ và tên" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item label="Nhập lại mật khẩu" name="confirmPassword" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
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
