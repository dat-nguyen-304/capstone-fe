'use client';

import { InputText } from '@/components/form-input';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { InputDescription } from '@/components/form-input/InputDescription';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import dynamic from 'next/dynamic';
import { videoApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface UploadVideoProps {
    params: { id: number };
}

const UploadVideo: React.FC<UploadVideoProps> = ({ params }) => {
    const { data, isLoading } = useQuery<any>({
        queryKey: ['course'],
        queryFn: () => videoApi.getVideoDetailByIdForAdminAndTeacher(params?.id)
    });
    console.log(data);

    const [uploadedImageFile, setUploadedImageFile] = useState<FileWithPath>();
    const onImageDrop = useCallback((acceptedFile: FileWithPath[]) => {
        setUploadedImageFile(acceptedFile[0]);
    }, []);

    const { getRootProps: getImageRootProps, getInputProps: getImageInputProps }: DropzoneRootProps = useDropzone({
        onDrop: onImageDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1,
        multiple: false
    });
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: data?.name,
            course: '',
            description: data?.description
        }
    });
    // const onSubmit = async (formData: any) => {
    //     try {
    //         // const videoRequest = {
    //         //     description: formData.description,
    //         //     name: formData.name,
    //         //     price: formData.price,
    //         //     subject: getSubjectNameById(selectedSubject),
    //         //     levelId: levelId,
    //         //     topic: topicsArray
    //         // };
    //         const videoRequest = {
    //             name: 'Video Khóa Học Cấp Tốc',
    //             videoId: 1,
    //             description: 'Video Tiếng Anh',
    //             videoStatus: 'PRIVATE',
    //             order: 0
    //         };

    //         console.log(videoRequest);
    //         console.log(uploadedImageFile);
    //         console.log(uploadedVideoFile);

    //         const formDataPayload = new FormData();
    //         formDataPayload.append(
    //             'videoRequest',
    //             new Blob([JSON.stringify(videoRequest)], { type: 'application/json' })
    //         );
    //         if (uploadedVideoFile) {
    //             formDataPayload.append('video', uploadedVideoFile);
    //         }

    //         if (uploadedImageFile) {
    //             formDataPayload.append('thumbnail', uploadedImageFile);
    //         }

    //         const response = await videoApi.createVideo(formDataPayload);
    //         console.log('Course created successfully:', response);
    //         // if (response) {
    //         //     router.push('/teacher/course/my-course');
    //         // }
    //         // Handle the response as needed
    //     } catch (error) {
    //         console.error('Error creating course:', error);
    //         // Handle error
    //     }
    // };
    if (!data) return <Loader />;
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Chỉnh sửa video</h3>
            <div className="lg:grid grid-cols-6 gap-2 mt-8">
                <div className="col-span-6">
                    <ReactPlayer
                        width="100%"
                        height="450px"
                        className="object-contain"
                        controls={true}
                        url="https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5"
                    />
                </div>
                <div className="col-span-2 h-[240px] border-2 border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer mt-4 mr-0 lg:mr-4">
                    <div {...getImageRootProps()}>
                        <input {...getImageInputProps()} name="avatar" />
                        {uploadedImageFile ? (
                            <div className="group relative">
                                <Image
                                    className="object-cover w-full h-[240px]"
                                    key={uploadedImageFile.path}
                                    src={URL.createObjectURL(uploadedImageFile)}
                                    alt={uploadedImageFile.path as string}
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
                <div className="col-span-4 sm:grid grid-cols-2 gap-2 my-4">
                    <div className="col-span-1 my-4 sm:my-0">
                        <InputText variant="bordered" name="name" size="sm" label="Tên Video" control={control} />
                    </div>
                    <div className="col-span-1 my-4 sm:my-0">
                        <Select
                            size="sm"
                            label="Khóa học"
                            color="primary"
                            variant="bordered"
                            defaultSelectedKeys={['0']}
                        >
                            <SelectItem key={0} value={0}>
                                Mặc định
                            </SelectItem>
                            <SelectItem key={1} value={1}>
                                Đánh giá cao nhất
                            </SelectItem>
                            <SelectItem key={2} value={2}>
                                Giá mua cao nhất
                            </SelectItem>
                            <SelectItem key={3} value={3}>
                                Giá mua thấp nhất
                            </SelectItem>
                            <SelectItem key={4} value={4}>
                                Nhiều đánh giá nhất
                            </SelectItem>
                        </Select>
                    </div>
                </div>
            </div>
            <div>
                <label className="block mt-4 mb-2 font-semibold">Mô tả</label>
                <InputDescription name="description" control={control} />
            </div>
            <div className="flex items-start mb-8 mt-20 sm:mt-16">
                <div className="flex items-center h-5">
                    <Checkbox />
                </div>
                <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Tôi đồng ý với{' '}
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                        chính sách và điều khoản của CEPA.
                    </a>
                </label>
            </div>
            <Button color="primary" className="mb-4">
                Xác nhận thay đổi
            </Button>
        </div>
    );
};

export default UploadVideo;
