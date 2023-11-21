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
interface EditTopicProps {
    params: { id: number };
}

const EditTopic: React.FC<EditTopicProps> = ({ params }) => {
    const { user } = useUser();
    const router = useRouter();
    const { data: discussionTopic, isLoading } = useQuery({
        queryKey: ['topicDetail'],
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
        try {
            const response = await discussionApi.updateTopic(
                {
                    name: formData.name,
                    description: formData.description
                },
                params?.id
            );
            if (!response.data.code) {
                router.push('/admin/topic');
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };
    if (!discussionTopic) return <Loader />;
    if (user?.role !== 'ADMIN') return <NotFound />;

    return (
        <div className="w-[90%] sm:w-4/5 mx-auto my-8">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="font-bold text-xl">Chỉnh sửa chủ đề</h3>
                <div className="sm:flex items-center mt-8 sm:mt-12 gap-8">
                    <InputText
                        name="name"
                        isRequired
                        label="Tên tiêu đề"
                        size="sm"
                        className="w-[100%] max-w-[360px] mb-2 sm:mb-0"
                        variant="bordered"
                        control={control}
                    />
                </div>
                <div className="mt-6">
                    <label className="text-sm font-semibold">Nội dung bài viết</label>

                    <InputFormula name="description" placeholder="Nội dung bài viết" control={control} />
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
                <Button color="primary" type="submit">
                    Chỉnh sửa chủ đề
                </Button>
            </form>
        </div>
    );
};

export default EditTopic;
