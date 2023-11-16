'use client';

import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { CreateTopic, Subject } from '@/types';
import { useForm } from 'react-hook-form';
import { InputText } from '@/components/form-input';
import { InputFormula } from '@/components/form-input/InputFormula';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { useUser } from '@/hooks';
import NotFound from '@/app/not-found';
import { discussionApi } from '@/api-client';
import { useRouter } from 'next/navigation';
interface EditTopicProps {
    params: { id: number };
}

const EditTopic: React.FC<EditTopicProps> = ({ params }) => {
    const { user } = useUser();
    const router = useRouter();
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            description: ''
        }
    });

    const onSubmit = async (formData: CreateTopic) => {
        try {
            const response = await discussionApi.createTopic({
                name: formData.name,
                description: formData.description
            });
            if (response) {
                router.push('/admin/topic');
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    if (user?.role !== 'ADMIN') return <NotFound />;

    return (
        <div className="w-[90%] sm:w-4/5 mx-auto my-8">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="font-bold text-xl">Tạo chủ đề</h3>
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
                    Tạo bài viết
                </Button>
            </form>
        </div>
    );
};

export default EditTopic;
