'use client';

import { InputText } from '@/components/form-input';
import React, { useCallback, useState } from 'react';
import { BiUpArrowAlt } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import {
    Button,
    Checkbox,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Tooltip,
    useDisclosure
} from '@nextui-org/react';
import { InputDescription } from '@/components/form-input/InputDescription';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { courseApi, videoApi } from '@/api-client';
import { useUser } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { Course } from '@/types';
import Loader from '@/components/Loader';
import { FaQuestionCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'cookies';
const UploadVideo: React.FC = () => {
    const currentUser = useUser();
    const [optionCourse, setOptionCourse] = useState<string>('NEW');
    const router = useRouter();
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: ''
        }
    });
    const { data: coursesData, isLoading } = useQuery({
        queryKey: optionCourse === 'NEW' ? ['coursesDraftList'] : ['coursesList'],
        queryFn: () => {
            if (optionCourse === 'NEW') {
                return courseApi.getAllOfTeacherDraft(0, 100, 'id', 'ASC');
            } else if (optionCourse === 'OLD') {
                return courseApi.getAllOfTeacher(0, 100);
            } else {
                return [];
            }
        }
    });

    const [selectedCourse, setSelectedCourse] = useState<number>();
    const [selectedStatusVideo, setSelectedStatusVideo] = useState<string>('PUBLIC');

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

    const [uploadedVideoFile, setUploadedVideoFile] = useState<FileWithPath>();
    const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);

    const onVideoDrop = useCallback((acceptedFile: FileWithPath[]) => {
        const file = acceptedFile[0];
        setUploadedVideoFile(file);
        const objectURL = URL.createObjectURL(file);
        setUploadedVideoUrl(objectURL);
    }, []);

    const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps }: DropzoneRootProps = useDropzone({
        onDrop: onVideoDrop,
        accept: {
            'video/mp4': ['.mp4']
        },
        maxFiles: 1,
        multiple: false
    });

    const [uploadedAttachedFiles, setUploadedAttachedFiles] = useState<FileWithPath[]>();
    const [uploadedAttachedUrl, setUploadedAttachedUrl] = useState<string | null>(null);
    const onAttachedDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setUploadedAttachedFiles(acceptedFiles);
    }, []);

    const { getRootProps: getAttachedRootProps, getInputProps: getAttachedInputProps }: DropzoneRootProps = useDropzone(
        {
            onDrop: onAttachedDrop,
            accept: {
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc', '.docx']
            },
            multiple: true
        }
    );

    const { isOpen, onOpen, onClose } = useDisclosure();

    const onSubmit = async (formData: any) => {
        let toastLoading;
        try {
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            const videoRequest = {
                name: formData.name,
                courseId: selectedCourse,
                description: formData.description,
                videoStatus: selectedStatusVideo,
                order: 0
            };

            console.log(videoRequest);
            console.log(uploadedImageFile);
            console.log(uploadedVideoFile);
            console.log(uploadedAttachedFiles);

            const formDataPayload = new FormData();
            formDataPayload.append(
                'videoRequest',
                new Blob([JSON.stringify(videoRequest)], { type: 'application/json' })
            );
            if (uploadedVideoFile) {
                formDataPayload.append('video', uploadedVideoFile);
            }

            if (uploadedImageFile) {
                formDataPayload.append('thumbnail', uploadedImageFile);
            }

            if (uploadedAttachedFiles !== undefined) {
                formDataPayload.append('material', uploadedAttachedFiles[0]);
            }
            let apiUrl = '';

            if (optionCourse == 'NEW') {
                const response = await videoApi.createVideoForNewCourse(formDataPayload);
                // apiUrl = 'https://course-service-cepa.azurewebsites.net/api/videos';
                // const response = await axios.post(apiUrl, formDataPayload, {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //         // Add any additional headers as needed (e.g., authorization)
                //         // 'Authorization': `Bearer ${yourAuthToken}`,
                //     }
                // });
                if (response) {
                    toast.success('Video đã được tạo thành công');
                    router.push('/teacher/video/my-video-draft');
                }
            } else if (optionCourse == 'OLD') {
                apiUrl = 'https://course-service-cepa.azurewebsites.net/api/videos/teacher/upload';
                const response = await videoApi.createVideo(formDataPayload);
                // const response = await axios.put(apiUrl, formDataPayload, {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //         // Add any additional headers as needed (e.g., authorization)
                //         // 'Authorization': `Bearer ${yourAuthToken}`,
                //     }
                // });
                if (response) {
                    toast.success('Video đã được tạo thành công');
                    router.push('/teacher/video/my-video-draft');
                }
            } else {
                toast.error('Cần phải chọn khóa học để tạo video');
            }
            toast.dismiss(toastLoading);
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error creating course:', error);
            // Handle error
        }
    };
    if (!coursesData) return <Loader />;
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Đăng tải video mới</h3>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="lg:grid grid-cols-6 gap-2 mt-8">
                    <div className="col-span-1">
                        <div {...getVideoRootProps()}>
                            <input {...getVideoInputProps()} name="avatar" />
                            <div className="border-2 border-neutral-300 flex items-center justify-center gap-2 rounded-xl cursor-pointer h-[40px]">
                                Tải lên video <BiUpArrowAlt size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-5">
                        {uploadedVideoFile && uploadedVideoUrl && (
                            <>
                                <div className="sm:flex items-center gap-2">
                                    <p className="truncate mt-2 sm:mt-0">Đã tải lên video: {uploadedVideoFile.path}</p>
                                    <Button
                                        size="sm"
                                        onClick={onOpen}
                                        variant="light"
                                        className="text-sm text-blue-700 underline px-0 hidden sm:block"
                                    >
                                        Xem trước
                                    </Button>
                                </div>
                                <div className="block sm:hidden mt-4">
                                    <video className="w-[98%] mx-auto" controls>
                                        <source src={uploadedVideoUrl} type="video/mp4" />
                                    </video>
                                </div>
                                <Modal size="5xl" isOpen={isOpen} onClose={onClose} className="hidden sm:block">
                                    <ModalContent>
                                        {onClose => (
                                            <>
                                                <ModalHeader className="flex flex-col gap-1">
                                                    Xem trước video
                                                </ModalHeader>
                                                <ModalBody className="flex items-center justify-center">
                                                    {/* <ReactPlayer url={uploadedVideoUrl} controls /> */}
                                                    <video className="w-4/5" controls>
                                                        <source src={uploadedVideoUrl} type="video/mp4" />
                                                    </video>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="danger" variant="light" onPress={onClose}>
                                                        Đóng
                                                    </Button>
                                                </ModalFooter>
                                            </>
                                        )}
                                    </ModalContent>
                                </Modal>
                            </>
                        )}
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
                        <div className="col-span-2">
                            <InputText
                                isRequired
                                variant="bordered"
                                name="name"
                                color="primary"
                                size="sm"
                                label="Tên Video"
                                control={control}
                            />
                        </div>
                        <div className="col-span-2 my-4 sm:grid grid-cols-2 gap-4">
                            <div className="col-span-1  ">
                                <Select
                                    isRequired
                                    size="sm"
                                    label="Loại khóa học"
                                    color="primary"
                                    variant="bordered"
                                    defaultSelectedKeys={['NEW']}
                                    onChange={event => setOptionCourse(event?.target?.value)}
                                >
                                    <SelectItem key={'NEW'} value={'NEW'}>
                                        Khóa học mới
                                    </SelectItem>
                                    <SelectItem key={'OLD'} value={'OLD'}>
                                        Khóa học cũ
                                    </SelectItem>
                                </Select>
                            </div>
                            <div className="col-span-1  ">
                                <Select
                                    isRequired
                                    size="sm"
                                    label="Trạng thái video"
                                    color="primary"
                                    variant="bordered"
                                    defaultSelectedKeys={['PUBLIC']}
                                    onChange={event => setSelectedStatusVideo(event?.target?.value)}
                                >
                                    <SelectItem key={'PUBLIC'} value={'PUBLIC'}>
                                        Công Khai
                                    </SelectItem>
                                    <SelectItem key={'PRIVATE'} value={'PRIVATE'}>
                                        Không công khai
                                    </SelectItem>
                                </Select>
                            </div>
                        </div>
                        <div className="col-span-2  ">
                            <Select
                                isRequired
                                size="sm"
                                label="Khóa học"
                                color="primary"
                                variant="bordered"
                                onChange={event => setSelectedCourse(Number(event.target.value))}
                            >
                                {coursesData?.data?.map((course: Course) => (
                                    <SelectItem key={course?.id} value={course?.id}>
                                        {course?.courseName}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="col-span-2 my-4">
                            <div {...getAttachedRootProps()} className="w-full sm:w-1/2">
                                <input {...getAttachedInputProps()} name="avatar" />
                                <div className="w-full border-2 border-neutral-300 flex items-center justify-center gap-2 rounded-xl cursor-pointer h-[40px]">
                                    {uploadedAttachedFiles ? 'Tải lại file đính kèm' : 'Tải lên file đính kèm'}
                                    <BiUpArrowAlt size={24} />
                                </div>
                            </div>

                            {uploadedAttachedFiles && (
                                <div className="mt-4">
                                    <label className="font-semibold">Đã tải lên file</label>
                                    {uploadedAttachedFiles.map(attachedFile => (
                                        <p key={attachedFile.path} className="truncate mt-2">
                                            {attachedFile.path}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block mt-4 mb-2 font-semibold">Mô tả</label>
                    <InputDescription name="description" control={control} />
                </div>
                <div className="flex items-start mb-8 mt-16">
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
                    Xác nhận video mới
                </Button>
            </form>
        </div>
    );
};

export default UploadVideo;
