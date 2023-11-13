'use client';

import { userApi } from '@/api-client';
import { InputPassword } from '@/components/form-input';
import { useUser } from '@/hooks';
import { changePasswordSchema } from '@/yup_schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card } from '@nextui-org/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface CourseListProps {}

const CourseList: React.FC<CourseListProps> = ({}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const { user } = useUser();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: user?.email,
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        resolver: yupResolver(changePasswordSchema)
    });

    const handleChangePassword = async (values: any) => {
        setIsLoading(true);
        try {
            const res = await userApi.changePassword(values);
            reset();
            if (!res.data.code) {
                setSuccessMessage('Đổi mật khẩu thành công');
                setErrorMessage('');
            } else if (res.data.code === 1) {
                setErrorMessage('Mật khẩu cũ không đúng');
                setSuccessMessage('');
            } else {
                setSuccessMessage('');
                setErrorMessage('Vui lòng thử lại sau');
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setErrorMessage('Vui lòng thử lại sao');
            setSuccessMessage('');
        }
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
                    {errorMessage && <p className="my-4 text-red-500 text-xs sm:text-sm">{errorMessage}</p>}
                    {successMessage && <p className="my-4 text-green-700 text-xs sm:text-sm">{successMessage}</p>}
                    <Button isLoading={isLoading} type="submit" color="primary">
                        Đổi mật khẩu
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default CourseList;
