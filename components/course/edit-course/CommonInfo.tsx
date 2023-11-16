'use client';

import { subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { InputText } from '@/components/form-input';
import { InputDescription } from '@/components/form-input/InputDescription';
import { InputNumber } from '@/components/form-input/InputNumber';
import { Subject } from '@/types';
import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { courseApi } from '@/api-client';
interface CommonInfoProps {
    commonInfo?: {
        id: number;
        name: string;
        thumbnail: string;
        level: string;
        description: string;
        price: number;
    };
    videoOrders: { videoId: number; videoOrder: number }[];
}

const CommonInfo: React.FC<CommonInfoProps> = ({ commonInfo, videoOrders }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll
    });
    const [levelId, setLevelId] = useState(1);
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: commonInfo?.name,
            course: '',
            description: commonInfo?.description,
            price: commonInfo?.price
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
            const courseRequest = {
                courseId: commonInfo?.id,
                description: formData.description,
                name: formData.name,
                price: Number(formData.price),
                levelId: levelId
            };

            console.log(courseRequest);
            console.log(uploadedFiles[0]);
            console.log(videoOrders);

            const formDataPayload = new FormData();
            formDataPayload.append(
                'courseRequest',
                new Blob([JSON.stringify(courseRequest)], { type: 'application/json' })
            );
            if (uploadedFiles[0]) {
                formDataPayload.append('thumbnail', uploadedFiles[0]);
            }
            if (!videoOrders) {
                formDataPayload.append('videoOrders', new Blob([JSON.stringify(null)], { type: 'application/json' }));
            } else {
                formDataPayload.append(
                    'videoOrders',
                    new Blob([JSON.stringify(videoOrders)], { type: 'application/json' })
                );
            }

            const response = await courseApi.updateCourse(formDataPayload);
            if (response) {
                console.log('Course update successfully:', response);
            }
            // router.push('/teacher/course/my-course');
            // Handle the response as needed
        } catch (error) {
            console.error('Error creating course:', error);
            // Handle error
        }
    };

    if (!data) return <Loader />;

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="md:grid grid-cols-6 mt-6">
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
                                // value={commonInfo?.name}
                            />
                        </div>
                        <div className="col-span-2 mt-4">
                            <InputNumber control={control} label="Giá" name="price" />
                        </div>
                        <div className="col-span-2 sm:grid grid-cols-2 gap-4">
                            {/* <div className="col-span-1 mt-12 md:mt-8">
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
                        </div> */}
                            <div className="col-span-1 mt-12 md:mt-8">
                                <Select
                                    label="Mức độ"
                                    color="primary"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    defaultSelectedKeys={
                                        commonInfo?.level == 'Nâng cao'
                                            ? ['3']
                                            : commonInfo?.level == 'Trung bình'
                                            ? ['2']
                                            : ['1']
                                    }
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
                <Button type="submit" color="primary">
                    Xác nhận thay đổi
                </Button>
            </form>
        </>
    );
};

export default CommonInfo;
