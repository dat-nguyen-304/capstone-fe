'use client';

import { InputText } from '@/components/form-input';
import React, { useCallback, useEffect, useState } from 'react';
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
    useDisclosure
} from '@nextui-org/react';
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
import { BiUpArrowAlt } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';
import { toast } from 'react-toastify';
import VideoRuleModal from '@/components/rule/VideoRuleModal';
interface UpdateVideoDraftProps {
    params: { id: number };
}

const UpdataVideoDraft: React.FC<UpdateVideoDraftProps> = ({ params }) => {
    const router = useRouter();
    const { data, isLoading } = useQuery<any>({
        queryKey: ['edit-video-teacher-detail', { params }],
        queryFn: () => videoApi.getVideoDraftById(params?.id)
    });
    const [uploadedVideoFile, setUploadedVideoFile] = useState<FileWithPath>();
    const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
    const [uploadedImageFile, setUploadedImageFile] = useState<FileWithPath>();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isCheckedPolicy, setIsCheckPolicy] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);
    const onImageDrop = useCallback((acceptedFile: FileWithPath[]) => {
        setUploadedImageFile(acceptedFile[0]);
    }, []);
    const [selectedVideoStatus, setSelectedVideoStatus] = useState<string>('PUBLIC');
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
    useEffect(() => {
        if (data) {
            setValue('name', data?.name);
            setValue('description', data?.description);
            setSelectedVideoStatus(data?.videoStatus ? data?.videoStatus : 'PUBLIC');
            setVideoUrl(data?.url);
            setFileUrl(data?.material);
        }
    }, [data]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const onSubmit = async (formData: any) => {
        if (!isCheckedPolicy) toast.error('Bạn cần đồng ý với điều khoản và chính sách của CEPA');
        else {
            const toastLoading = toast.loading('Đang xử lí yêu cầu');
            try {
                setIsSubmitting(true);
                const videoRequest = {
                    name: formData?.name,
                    videoTemporaryId: Number(params?.id),
                    description: formData?.description,
                    videoStatus: selectedVideoStatus
                };

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

                const response = await videoApi.updateVideoDraft(formDataPayload);

                if (response) {
                    toast.dismiss(toastLoading);
                    setIsSubmitting(false);
                    toast.success('Video đã được cập nhật thành công');
                    router.push('/teacher/video/my-video-draft');
                }
                // Handle the response as needed
            } catch (error) {
                toast.dismiss(toastLoading);
                setIsSubmitting(false);
                toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
                console.error('Error creating course:', error);
                // Handle error
            }
        }
    };

    const removeAttachedFile = (file?: FileWithPath) => {
        if (file) {
            const newAttachedFiles = uploadedAttachedFiles?.filter(f => f.path !== file.path);
            if (!newAttachedFiles?.length) setUploadedAttachedFiles(undefined);
            else setUploadedAttachedFiles(newAttachedFiles);
        } else setFileUrl(null);
    };

    if (!data) return <Loader />;

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <div className="mt-4 sm:mt-0 flex justify-between">
                <h3 className="text-xl text-blue-500 font-semibold">Chỉnh sửa video</h3>
                <Button size="sm" variant="flat" onClick={() => router.back()}>
                    <BsArrowLeft />
                    <span>Quay lại</span>
                </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="lg:grid grid-cols-6 gap-2 mt-8">
                    {/* <div className="col-span-6">
                        <ReactPlayer
                            width="100%"
                            height="450px"
                            className="object-contain"
                            controls={true}
                            url="https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5"
                        />
                    </div> */}
                    <div className="col-span-1">
                        <div {...getVideoRootProps()}>
                            <input {...getVideoInputProps()} name="avatar" />
                            <div className="border-2 border-neutral-300 flex items-center justify-center gap-2 rounded-xl cursor-pointer h-[40px]">
                                Tải video khác
                                <BiUpArrowAlt size={24} />{' '}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-5">
                        {uploadedVideoFile && uploadedVideoUrl ? (
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
                        ) : videoUrl ? (
                            <>
                                <div className="sm:flex items-center gap-2">
                                    <p className="truncate mt-2 sm:mt-0">Video đã tải: </p>
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
                                        <source src={videoUrl} type="video/mp4" />
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
                                                        <source src={videoUrl} type="video/mp4" />
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
                        ) : null}
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
                                        className="object-cover w-full h-[240px]"
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
                                isRequired
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
                                isRequired
                                size="sm"
                                label="Trạng Thái Video"
                                color="primary"
                                variant="bordered"
                                defaultSelectedKeys={data?.videoStatus ? [`${data?.videoStatus}`] : ['PUBLIC']}
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
                        <div className="col-span-2 my-4">
                            <div {...getAttachedRootProps()}>
                                <input {...getAttachedInputProps()} name="avatar" />
                                <div className="w-full sm:w-1/2 border-2 border-neutral-300 flex items-center justify-center gap-2 rounded-xl cursor-pointer h-[40px]">
                                    Tải lên file đính kèm <BiUpArrowAlt size={24} />{' '}
                                </div>
                            </div>
                            {uploadedAttachedFiles ? (
                                <div className="mt-4">
                                    <label className="font-semibold">Đã tải lên file</label>
                                    {uploadedAttachedFiles.map(attachedFile => (
                                        <p key={attachedFile.path} className="truncate mt-2">
                                            {attachedFile.path}
                                        </p>
                                    ))}
                                </div>
                            ) : fileUrl ? (
                                <div className="mt-4">
                                    <label className="font-semibold text-blue-500">Đã tải lên file</label>
                                    <div className="flex items-center">
                                        <p className="truncate mt-2">{fileUrl}</p>
                                        <Button
                                            color="danger"
                                            size="sm"
                                            variant="flat"
                                            className="mt-2 ml-2 !h-[24px]"
                                            onClick={() => removeAttachedFile()}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block mt-4 mb-2 font-semibold">Mô tả</label>
                    <InputDescription name="description" control={control} />
                </div>
                <div className="flex items-start mb-8 mt-20 sm:mt-16">
                    <div className="flex items-center h-5">
                        <Checkbox isSelected={isCheckedPolicy} onValueChange={setIsCheckPolicy} />
                    </div>
                    <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Tôi đồng ý với{' '}
                        <a
                            className="text-blue-600 hover:underline dark:text-blue-500"
                            onClick={() => setOpenVideo(true)}
                        >
                            chính sách và điều khoản của CEPA.
                        </a>
                    </label>
                </div>
                <Button color="primary" type="submit" className="mb-4" isLoading={isSubmitting}>
                    Xác nhận thay đổi
                </Button>
            </form>
            <VideoRuleModal isOpen={openVideo} onOpen={() => setOpenVideo(true)} onClose={() => setOpenVideo(false)} />
        </div>
    );
};

export default UpdataVideoDraft;
