'use client';

import { InputText } from '@/components/form-input';
import React, { useCallback, useEffect, useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
interface UploadVideoProps {
    params: { id: number };
}

const UploadVideo: React.FC<UploadVideoProps> = ({ params }) => {
    const router = useRouter();
    const { data, isLoading } = useQuery<any>({
        queryKey: ['course'],
        queryFn: () => videoApi.getVideoDetailByIdForAdminAndTeacher(params?.id)
    });

    const [uploadedImageFile, setUploadedImageFile] = useState<FileWithPath>();
    const onImageDrop = useCallback((acceptedFile: FileWithPath[]) => {
        setUploadedImageFile(acceptedFile[0]);
    }, []);
    const [selectedVideoStatus, setSelectedVideoStatus] = useState<string>('PUBLIC');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const { getRootProps: getImageRootProps, getInputProps: getImageInputProps }: DropzoneRootProps = useDropzone({
        onDrop: onImageDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1,
        multiple: false
    });
    const { control, handleSubmit, setError, setValue } = useForm({
        defaultValues: {
            name: data?.name,
            course: '',
            description: data?.description
        }
    });
    console.log(data);

    useEffect(() => {
        if (data) {
            setValue('name', data?.name);
            setValue('description', data?.description);
            setSelectedVideoStatus(data?.videoStatus);
            setVideoUrl(data?.url);
        }
    }, [data]);
    const onSubmit = async (formData: any) => {
        let toastLoading;
        try {
            toastLoading = toast.loading('Đang xử lí yêu cầu');

            const videoRequest = {
                name: formData?.name,
                videoId: params?.id,
                description: formData?.description,
                videoStatus: selectedVideoStatus
            };

            console.log(videoRequest);

            const response = await videoApi.updateVideo(videoRequest);

            if (response) {
                toast.success('Video đã được chỉnh sửa thành công');
                router.push('/teacher/video/my-video-draft');
            }
            toast.dismiss(toastLoading);
            // Handle the response as needed
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error creating course:', error);
            // Handle error
        }
    };
    if (!data) return <Loader />;
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Chỉnh sửa video</h3>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="lg:grid grid-cols-6 gap-2 mt-8">
                    <div className="col-span-6">
                        <ReactPlayer
                            width="100%"
                            height="450px"
                            className="object-contain"
                            controls={true}
                            url={
                                videoUrl
                                    ? videoUrl
                                    : 'https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5'
                            }
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
                            ) : data?.thumbnail ? (
                                <div className="group relative">
                                    <Image
                                        className="object-cover w-full h-[120px]"
                                        key={data?.thumbnail}
                                        src={data?.thumbnail}
                                        alt={data?.thumbnail as string}
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
                            <InputText
                                color="primary"
                                variant="bordered"
                                name="name"
                                size="sm"
                                label="Tên Video"
                                control={control}
                            />
                        </div>
                        <div className="col-span-1 my-4 sm:my-0">
                            <Select
                                size="sm"
                                label="Trạng Thái Video"
                                color="primary"
                                variant="bordered"
                                defaultSelectedKeys={[`${selectedVideoStatus}`]}
                                onChange={event => setSelectedVideoStatus(String(event.target.value))}
                            >
                                <SelectItem key={'PUBLIC'} value={'PUBLIC'}>
                                    Công Khai
                                </SelectItem>
                                <SelectItem key={'PRIVATE'} value={'PRIVATE'}>
                                    Riêng Tư
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
                <Button color="primary" type="submit" className="mb-4">
                    Xác nhận thay đổi
                </Button>
            </form>
        </div>
    );
};

export default UploadVideo;
