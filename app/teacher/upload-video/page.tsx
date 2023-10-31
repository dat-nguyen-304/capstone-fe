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
    useDisclosure
} from '@nextui-org/react';
import { InputDescription } from '@/components/form-input/InputDescription';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';

const UploadVideo: React.FC = () => {
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: ''
        }
    });

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
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mb-8">Đăng tải video mới</h3>
            <div className="lg:grid grid-cols-6 gap-2">
                <div className="col-span-1">
                    <div {...getVideoRootProps()}>
                        <input {...getVideoInputProps()} name="avatar" />
                        <div className="border-2 border-neutral-300 flex items-center justify-center gap-2 rounded-xl cursor-pointer h-[40px]">
                            Tải lên video <BiUpArrowAlt size={24} />{' '}
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
                                            <ModalHeader className="flex flex-col gap-1">Xem trước video</ModalHeader>
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
                <div className="col-span-2 h-[240px] border-2 border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer mt-4 mr-4">
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
                        <InputText variant="bordered" name="name" size="sm" label="Tên Video" control={control} />
                    </div>
                    <div className="col-span-1 my-4">
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
                    <div className="col-span-1 my-4">
                        <Select
                            size="sm"
                            label="Thêm vào"
                            color="primary"
                            variant="bordered"
                            defaultSelectedKeys={['0']}
                        >
                            <SelectItem key={0} value={0}>
                                Cuối danh sách
                            </SelectItem>
                            <SelectItem key={1} value={1}>
                                Đầu danh sách
                            </SelectItem>
                        </Select>
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
            <Button color="primary" className="mb-4">
                Xác nhận video mới
            </Button>
        </div>
    );
};

export default UploadVideo;
