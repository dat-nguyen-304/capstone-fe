'use client';

import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { useForm } from 'react-hook-form';
import { InputText } from '@/components/form-input';
import { InputFormula } from '@/components/form-input/InputFormula';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { useUser } from '@/hooks';
import NotFound from '@/app/not-found';
import { discussionApi } from '@/api-client';
import { useRouter } from 'next/navigation';
import { CreateTopicObject } from '@/types';
import { toast } from 'react-toastify';
import { BsArrowLeft } from 'react-icons/bs';
interface EditTopicProps {
    params: { id: number };
}

const EditTopic: React.FC<EditTopicProps> = ({ params }) => {
    const { user } = useUser();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { data: discussionTopic, isLoading } = useQuery({
        queryKey: ['topicDetail', { params: params?.id }],
        queryFn: () => discussionApi.getTopicById(params?.id)
    });
    console.log(discussionTopic);

    const { control, handleSubmit, setError, setValue } = useForm({
        defaultValues: {
            name: '',
            description: ''
        }
    });

    useEffect(() => {
        if (discussionTopic) {
            setValue('name', discussionTopic?.name);
            setValue('description', discussionTopic?.description);
        }
    }, [discussionTopic]);

    const onSubmit = async (formData: CreateTopicObject) => {
        const toastLoading = toast.loading('Đang chỉnh sửa chủ đề');
        try {
            setIsSubmitting(true);
            const response = await discussionApi.updateTopic(
                {
                    name: formData.name,
                    description: formData.description
                },
                params?.id
            );
            if (!response.data.code) {
                toast.success('Chỉnh sửa thành công');
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
    if (!discussionTopic) return <Loader />;
    if (user?.role !== 'ADMIN') return <NotFound />;

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Chỉnh sửa chủ đề</h3>
                    <Button variant="faded" onClick={() => router.back()} size="sm">
                        <BsArrowLeft /> Quay lại
                    </Button>
                </div>
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
                    <label className="text-sm font-semibold text-blue-500">Mô tả chủ đề</label>

                    <InputFormula name="description" placeholder="Nội dung" control={control} />
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
                    Chỉnh sửa chủ đề
                </Button>
            </form>
        </div>
    );
};

export default EditTopic;
