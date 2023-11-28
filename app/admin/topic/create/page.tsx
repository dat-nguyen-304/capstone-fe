'use client';

import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import Loader from '@/components/Loader';
import { CreateTopicObject, Subject } from '@/types';
import { useForm } from 'react-hook-form';
import { InputText } from '@/components/form-input';
import { InputFormula } from '@/components/form-input/InputFormula';
import { useUser } from '@/hooks';
import NotFound from '@/app/not-found';
import { discussionApi } from '@/api-client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useState } from 'react';
interface CreateTopicProps {}

const CreateTopic: React.FC<CreateTopicProps> = ({}) => {
    const { user } = useUser();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            description: ''
        }
    });

    const onSubmit = async (formData: CreateTopicObject) => {
        const toastLoading = toast.loading('Đang tạo chủ đề');
        try {
            setIsSubmitting(true);
            const response = await discussionApi.createTopic({
                name: formData.name,
                description: formData.description
            });
            if (!response.data.code) {
                toast.success('Tạo chủ đề thành công');
                toast.dismiss(toastLoading);
                setIsSubmitting(false);
                router.push('/admin/topic');
            }
        } catch (error) {
            setIsSubmitting(false);
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error creating course:', error);
        }
    };

    if (user?.role !== 'ADMIN') return <NotFound />;

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Tạo chủ đề</h3>
                <div className="sm:flex items-center mt-8 sm:mt-12 gap-8">
                    <InputText
                        name="name"
                        isRequired
                        label="Tên tiêu đề"
                        size="sm"
                        className="w-[100%] max-w-[360px] mb-2 sm:mb-0"
                        variant="bordered"
                        control={control}
                        color="primary"
                    />
                </div>
                <div className="mt-6">
                    <label className="text-sm font-semibold text-blue-500">Mô tả</label>

                    <InputFormula name="description" placeholder="Mô tả chủ đề" control={control} />
                </div>
                <div className="flex items-start mt-16 mb-6">
                    <div className="flex items-center h-5">
                        <Checkbox />
                    </div>
                    <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Tôi đồng ý{' '}
                        <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                            với chính sách và điều khoản của CEPA.
                        </a>
                    </label>
                </div>
                <Button color="primary" type="submit" isLoading={isSubmitting}>
                    Tạo chủ đề
                </Button>
            </form>
        </div>
    );
};

export default CreateTopic;
