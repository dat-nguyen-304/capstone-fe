'use client';

import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { Subject } from '@/types';
import { useForm } from 'react-hook-form';
import { InputText } from '@/components/form-input';
import { InputFormula } from '@/components/form-input/InputFormula';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';

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

    const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[]>([]);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setUploadedFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, fileRejections }: DropzoneRootProps = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1,
        multiple: false
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
                <div className="h-[100px] w-[160px] border-2 border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer mt-4">
                    <div {...getRootProps()}>
                        <input {...getInputProps()} name="avatar" />
                        {uploadedFiles.length ? (
                            <div className="group relative">
                                <Image
                                    className="object-cover w-full h-[100px]"
                                    key={uploadedFiles[0].path}
                                    src={URL.createObjectURL(uploadedFiles[0])}
                                    alt={uploadedFiles[0].path as string}
                                    width={160}
                                    height={100}
                                />
                                <div className="absolute top-0 right-0 bottom-0 left-0 hidden text-white group-hover:flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)]">
                                    <RiImageEditLine size={28} />
                                    <span className="text-sm">Cập nhật ảnh</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center">
                                <RiImageAddLine size={28} />
                                <span className="text-sm">Thêm ảnh</span>
                            </div>
                        )}
                    </div>
                </div>
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
