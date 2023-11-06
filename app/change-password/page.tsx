'use client';

import { InputPassword, InputText } from '@/components/form-input';
import { changePasswordSchema } from '@/yup_schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card } from '@nextui-org/react';
import { Form, useForm } from 'react-hook-form';

interface CourseListProps {}

const CourseList: React.FC<CourseListProps> = ({}) => {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        resolver: yupResolver(changePasswordSchema)
    });

    const handleChangePassword = (values: any) => {
        console.log(values);
    };
    return (
        <div className="w-[90%] sm:w-4/5 md:w-3/5 xl:w-2/5 3xl:w-[30%] mx-auto my-8 sm:my-16">
            <Card className="p-4">
                <h3 className="text-blue-700 font-semibold text-lg">Đổi mật khẩu</h3>
                <form onSubmit={handleSubmit(handleChangePassword)}>
                    <InputPassword
                        name="oldPassword"
                        control={control}
                        className="my-4"
                        label="Mật khẩu cũ"
                        variant="bordered"
                    />
                    <InputPassword
                        name="newPassword"
                        control={control}
                        className="my-4"
                        label="Mật khẩu mới"
                        variant="bordered"
                    />
                    <InputPassword
                        name="confirmPassword"
                        control={control}
                        className="my-4"
                        label="Xác nhận mật khẩu"
                        variant="bordered"
                    />
                    <Button type="submit" color="primary">
                        Đổi mật khẩu
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default CourseList;
