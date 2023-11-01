'use client';

import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Select, SelectItem, Selection } from '@nextui-org/react';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import { subjectApi } from '@/api-client';
import { Subject } from '@/types';
import { InputText } from '@/components/form-input';
import { InputDescription } from '@/components/form-input/InputDescription';
import Loader from '@/components/Loader';
import { InputNumber } from '@/components/form-input/InputNumber';
import { useDropzone, FileWithPath, DropzoneRootProps } from 'react-dropzone';

const EditCourse: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll
    });
    const [values, setValues] = useState<Selection>(new Set(['1']));
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: ''
        }
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
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mb-8">Chỉnh sửa khóa học</h3>
            <div className="md:grid grid-cols-6">
                <div className="md:col-span-3 lg:col-span-2">
                    <label className="font-semibold block mb-2">Ảnh thu nhỏ</label>
                    <div className="h-[240px] border-2 border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer">
                        <div {...getRootProps()}>
                            <input {...getInputProps()} name="avatar" />
                            {uploadedFiles.length ? (
                                <div className="group relative">
                                    <Image
                                        className="object-cover w-full h-[240px]"
                                        key={uploadedFiles[0].path}
                                        src={URL.createObjectURL(uploadedFiles[0])}
                                        alt={uploadedFiles[0].path as string}
                                        width={240}
                                        height={240}
                                    />
                                    <div className="absolute top-0 right-0 bottom-0 left-0 hidden text-white group-hover:flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)]">
                                        <RiImageEditLine size={40} />
                                        <span className="text-sm">Cập nhật ảnh thu nhỏ</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col justify-center items-center">
                                    <RiImageAddLine size={40} />
                                    <span className="text-sm">Tải lên ảnh thu nhỏ</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="md:col-span-3 lg:col-span-4 grid grid-cols-2 md:ml-[20px] mt-12 md:mt-8">
                    <div className="col-span-2">
                        <InputText
                            variant="bordered"
                            name="name"
                            labelPlacement="outside"
                            label="Tên khóa học"
                            control={control}
                        />
                    </div>
                    <div className="col-span-2">
                        <InputNumber control={control} label="Giá" name="price" />
                    </div>
                    <div className="col-span-2 sm:grid grid-cols-2 gap-4">
                        <div className="col-span-1 mt-8">
                            <Select
                                label="Chọn môn học"
                                color="primary"
                                variant="bordered"
                                labelPlacement="outside"
                                defaultSelectedKeys={['1']}
                            >
                                {data.map((subject: Subject) => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="col-span-1 mt-8">
                            <Select
                                label="Mức độ"
                                color="primary"
                                variant="bordered"
                                labelPlacement="outside"
                                defaultSelectedKeys={['0']}
                            >
                                <SelectItem key={0} value={0}>
                                    Cơ bản
                                </SelectItem>
                                <SelectItem key={1} value={1}>
                                    Trung bình
                                </SelectItem>
                                <SelectItem key={2} value={2}>
                                    Nâng cao
                                </SelectItem>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <label className="font-semibold">Mô tả</label>
                <InputDescription name="description" control={control} />
            </div>
            <div className="flex items-start mb-8 mt-16">
                <div className="flex items-center h-5">
                    <Checkbox />
                </div>
                <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Tôi đồng ý với{' '}
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                        chính sách và điều khoản của CEPA
                    </a>
                    .
                </label>
            </div>
            <Button color="primary">Xác nhận video mới</Button>
        </div>
    );
};

export default EditCourse;
