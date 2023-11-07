'use client';

import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { Button, Checkbox, Input, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { Subject } from '@/types';
import { useForm } from 'react-hook-form';
import { InputText } from '@/components/form-input';
import { InputFormula } from '@/components/form-input/InputFormula';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            title: '',
            course: '',
            description: ''
        }
    });
    const { data } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll
    });
    if (!data) return <Loader />;
    return (
        <div className="w-[90%] sm:w-4/5 mx-auto my-8">
            <h3 className="font-bold text-xl">Tạo bài viết</h3>
            <div className="sm:flex items-center mt-8 sm:mt-12 gap-8">
                <InputText
                    name="title"
                    isRequired
                    label="Tên tiêu đề"
                    size="sm"
                    className="w-[100%] max-w-[360px] mb-2 sm:mb-0"
                    variant="bordered"
                    control={control}
                />
                <Select isRequired items={data} label="Chọn môn" variant="bordered" size="sm" className="max-w-xs">
                    {(subject: Subject) => <SelectItem key={subject.id}>{subject.name}</SelectItem>}
                </Select>
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
            <Button color="primary">Tạo bài viết</Button>
        </div>
    );
};

export default CreatePost;
