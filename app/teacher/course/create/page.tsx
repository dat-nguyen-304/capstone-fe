'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Select, SelectItem, Selection } from '@nextui-org/react';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import { subjectApi, topicApi, courseApi } from '@/api-client';
import { Subject, Topic } from '@/types';
import { InputText } from '@/components/form-input';
import { InputDescription } from '@/components/form-input/InputDescription';
import Loader from '@/components/Loader';
import { InputNumber } from '@/components/form-input/InputNumber';
import { useDropzone, FileWithPath, DropzoneRootProps } from 'react-dropzone';
import { useRouter } from 'next/navigation';
const getSubjectNameById = (id: number): string => {
    if (id == 1) {
        return 'Toán học';
    } else if (id == 2) {
        return 'Vật lí';
    } else if (id == 3) {
        return 'Hóa học';
    } else if (id == 4) {
        return 'Tiếng anh';
    } else if (id == 5) {
        return 'Sinh học';
    } else if (id == 6) {
        return 'Lịch sử';
    } else if (id == 7) {
        return 'Địa lý';
    } else {
        return '';
    }
};
const CreateCourse: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState<number>(1);
    const [values, setValues] = useState<Selection>(new Set(['1']));
    const [selectedTopics, setSelectedTopics] = useState<string>('');
    const [levelId, setLevelId] = useState(1);
    const router = useRouter();
    const { data: subjectsData, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll
    });

    const { data: topicsData } = useQuery({
        queryKey: ['topics', selectedSubject],
        queryFn: () => (selectedSubject !== 0 ? topicApi.getTopicsBySubject(selectedSubject) : [])
    });

    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: '',
            subject: ''
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

    const onSubmit = async (formData: any) => {
        try {
            // const phrases = selectedTopics.split(',');
            // const quotedPhrases = phrases.map(phrase => `"${phrase.trim()}"`);
            // const result = quotedPhrases.join(',');
            const phrases = selectedTopics.split(',');
            const topicsArray = phrases.map(phrase => phrase.trim());
            const courseRequest = {
                description: formData.description,
                name: formData.name,
                price: formData.price,
                subject: getSubjectNameById(selectedSubject),
                levelId: levelId,
                topic: topicsArray
            };

            console.log(courseRequest);
            console.log(uploadedFiles[0]);

            const formDataPayload = new FormData();
            formDataPayload.append(
                'courseRequest',
                new Blob([JSON.stringify(courseRequest)], { type: 'application/json' })
            );
            formDataPayload.append('thumbnail', uploadedFiles[0]);

            const response = await courseApi.createCourse(formDataPayload);
            if (response) {
                console.log('Course created successfully:', response);
                router.push('/teacher/course/my-course');
            }
            // Handle the response as needed
        } catch (error) {
            console.error('Error creating course:', error);
            // Handle error
        }
    };

    if (!subjectsData) return <Loader />;
    if (!topicsData) return <Loader />;

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Tạo khóa học mới</h3>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="md:grid grid-cols-6 mt-8">
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
                        <div className="col-span-2 sm:grid grid-cols-2 gap-4">
                            <div className="col-span-1 mt-1">
                                <InputNumber control={control} label="Giá" name="price" />
                            </div>
                            <div className="col-span-1 mt-12 md:mt-8">
                                <Select
                                    isRequired
                                    label="Chọn chủ đề môn học"
                                    color="primary"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    selectionMode="multiple"
                                    // defaultSelectedKeys={[String(topicSelected)]}
                                    value={selectedTopics}
                                    onChange={value => setSelectedTopics(value.target.value)}
                                >
                                    {topicsData?.map((topic: Topic) => (
                                        <SelectItem key={topic?.name} value={topic?.id}>
                                            {topic?.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="col-span-2 sm:grid grid-cols-2 gap-4">
                            <div className="col-span-1 mt-12 md:mt-8">
                                <Select
                                    label="Chọn môn học"
                                    color="primary"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    defaultSelectedKeys={[String(selectedSubject)]}
                                    value={selectedSubject}
                                    name="subject"
                                    onChange={event => setSelectedSubject(Number(event.target.value))}
                                >
                                    {subjectsData.map((subject: Subject) => (
                                        <SelectItem key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="col-span-1 mt-12 md:mt-8">
                                <Select
                                    label="Mức độ"
                                    color="primary"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    defaultSelectedKeys={['1']}
                                    onChange={event => setLevelId(Number(event.target.value))}
                                >
                                    <SelectItem key={1} value={1}>
                                        Cơ bản
                                    </SelectItem>
                                    <SelectItem key={2} value={2}>
                                        Trung bình
                                    </SelectItem>
                                    <SelectItem key={3} value={3}>
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
                <div className="flex items-start mb-8 mt-20 sm:mt-16">
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
                <Button color="primary" type="submit">
                    Tạo khóa học mới
                </Button>
            </form>
        </div>
    );
};

export default CreateCourse;
