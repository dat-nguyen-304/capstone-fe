'use client';

import { InputText } from '@/components/form-input';
import React, { useCallback, useEffect, useState } from 'react';
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
import { courseApi, videoApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { Course } from '@/types';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import VideoRuleModal from '@/components/rule/VideoRuleModal';
import { useSelectedSidebar } from '@/hooks';

const UploadVideo: React.FC = () => {
    const router = useRouter();
    const [selectedOptionCourse, setSelectedOptionCourse] = useState<string>();
    const [optionCourse, setOptionCourse] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [isCheckedPolicy, setIsCheckPolicy] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: ''
        }
    });

    const { data: updatingCoursesData, isLoading: isUpdatingCourseLoading } = useQuery({
        queryKey: ['draftCoursesList'],
        queryFn: () => courseApi.getAllOfTeacherDraft('', 'ALL', 0, 100, 'createdDate', 'DESC')
    });

    const { data: activatedCoursesData, isLoading: isActivatedCourseLoading } = useQuery({
        queryKey: ['coursesList'],
        queryFn: () => courseApi.getAllOfTeacher('', 'AVAILABLE', 0, 100, 'createdDate', 'DESC')
    });

    const { onTeacherKeys } = useSelectedSidebar();

    useEffect(() => {
        onTeacherKeys(['3']);
    }, []);

    useEffect(() => {
        let arr: string[] = [];
        if (activatedCoursesData?.data?.length) {
            arr.push('OLD');
            setSelectedOptionCourse('OLD');
        }
        if (updatingCoursesData?.data?.length) {
            arr.push('NEW');
            setSelectedOptionCourse('NEW');
        }
        setOptionCourse(arr);
    }, [activatedCoursesData, updatingCoursesData]);

    useEffect(() => {
        if (selectedOptionCourse) {
            if (selectedOptionCourse === 'NEW') setCourses(updatingCoursesData?.data);
            else setCourses(activatedCoursesData?.data);
        }
    }, [selectedOptionCourse]);

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

    const removeAttachedFile = (file: FileWithPath) => {
        const newAttachedFiles = uploadedAttachedFiles?.filter(f => f.path !== file.path);
        if (!newAttachedFiles?.length) setUploadedAttachedFiles(undefined);
        else setUploadedAttachedFiles(newAttachedFiles);
    };

    const [uploadedAttachedFiles, setUploadedAttachedFiles] = useState<FileWithPath[]>();
    const onAttachedDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setUploadedAttachedFiles(acceptedFiles);
    }, []);

    const { getRootProps: getAttachedRootProps, getInputProps: getAttachedInputProps }: DropzoneRootProps = useDropzone(
        {
            onDrop: onAttachedDrop,
            accept: {
                'application/pdf': ['.pdf']
                // 'application/msword': ['.doc', '.docx']
            },
            multiple: true
        }
    );

    const { isOpen, onOpen, onClose } = useDisclosure();

    const onSubmit = async (formData: any) => {
        if (!isCheckedPolicy) toast.error('Bạn cần đồng ý với điều khoản và chính sách của CEPA');
        else if (!uploadedVideoFile) {
            toast.error('Bạn cần chọn video để đăng tải');
        } else if (!uploadedImageFile) {
            toast.error('Bạn cần chọn thumbnail cho video');
        } else {
            const toastLoading = toast.loading('Đang xử lí yêu cầu');
            try {
                setIsSubmitting(true);
                const videoRequest = {
                    name: formData.name,
                    courseId: selectedCourse,
                    description: formData.description,
                    videoStatus: selectedStatusVideo,
                    order: 0
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

                if (selectedOptionCourse == 'NEW') {
                    const response = await videoApi.createVideoForNewCourse(formDataPayload);

                    if (response) {
                        setIsSubmitting(false);
                        toast.success('Video đã được tạo thành công');
                        router.push('/teacher/video/my-video-draft');
                    }
                } else if (selectedOptionCourse == 'OLD') {
                    const response = await videoApi.createVideo(formDataPayload);

                    if (response) {
                        setIsSubmitting(false);
                        toast.success('Video đã được tạo thành công');
                        router.push('/teacher/video/my-video-draft');
                    }
                } else {
                    toast.error('Cần phải chọn khóa học để tạo video');
                }
                toast.dismiss(toastLoading);
            } catch (error) {
                toast.dismiss(toastLoading);
                setIsSubmitting(false);
                toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
                console.error('Error creating course:', error);
                // Handle error
            }
        }
    };
    if (isActivatedCourseLoading || isUpdatingCourseLoading) return <Loader />;

    if (!optionCourse.length) return <div>Vui lòng tạo khóa học</div>;

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Đăng tải video mới</h3>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="lg:grid grid-cols-6 gap-2 mt-8">
                    <div className="lg:col-span-2 xl:col-span-1">
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
                        <div className="col-span-1">
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
                        <div>
                            <Select
                                isRequired
                                size="sm"
                                label="Loại video mới"
                                description="Học sinh có thể xem video xem trước trước khi thanh toán."
                                color="primary"
                                variant="bordered"
                                defaultSelectedKeys={['PUBLIC']}
                                onChange={event => setSelectedStatusVideo(event?.target?.value)}
                            >
                                <SelectItem key={'PUBLIC'} value={'PUBLIC'}>
                                    Xem trước
                                </SelectItem>
                                <SelectItem key={'PRIVATE'} value={'PRIVATE'}>
                                    Không công khai
                                </SelectItem>
                            </Select>
                        </div>
                        <div className="col-span-2 my-4 sm:grid grid-cols-2 gap-4">
                            {optionCourse.length === 2 && selectedOptionCourse ? (
                                <div className="col-span-2">
                                    <Select
                                        isRequired
                                        size="sm"
                                        label="Video này thuộc"
                                        color="primary"
                                        variant="bordered"
                                        defaultSelectedKeys={[selectedOptionCourse]}
                                        onChange={event => setSelectedOptionCourse(event?.target?.value)}
                                        description="Khóa học đang cập nhật là những khóa học đang cập nhật thông tin và chưa được phê duyệt từ hệ thống. Khóa học đang hoạt động là những khóa học hiện đang được đăng bán"
                                    >
                                        <SelectItem key={'NEW'} value={'NEW'}>
                                            Khóa học đang cập nhật
                                        </SelectItem>
                                        <SelectItem key={'OLD'} value={'OLD'}>
                                            Khóa học đang hoạt động
                                        </SelectItem>
                                    </Select>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="col-span-2">
                            <Select
                                isRequired
                                size="sm"
                                label="Khóa học"
                                color="primary"
                                description="Video của bạn sẽ được đưa vào cuối danh sách của khóa học này. Bạn có thể thay đổi trình tự của video trong khóa học tại phần 'Chỉnh sửa khóa học'."
                                variant="bordered"
                                onChange={event => setSelectedCourse(Number(event.target.value))}
                            >
                                {courses?.map((course: Course) => (
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
                                    <label className="font-semibold text-[#1877f1]">Đã tải lên file</label>
                                    {uploadedAttachedFiles.map(attachedFile => (
                                        <div className="flex items-center" key={attachedFile.path}>
                                            <p className="truncate mt-2">{attachedFile.path}</p>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                variant="flat"
                                                className="mt-2 ml-2 !h-[24px]"
                                                onClick={() => removeAttachedFile(attachedFile)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block mt-4 mb-2 font-semibold text-[#1877f1]">Mô tả</label>
                    <InputDescription name="description" control={control} />
                </div>
                <div className="flex items-start mb-8 mt-16">
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
                <Button color="primary" type="submit" className="text-xs sm:text-sm mb-4" isLoading={isSubmitting}>
                    Xác nhận video mới
                </Button>
            </form>
            <VideoRuleModal isOpen={openVideo} onOpen={() => setOpenVideo(true)} onClose={() => setOpenVideo(false)} />
        </div>
    );
};

export default UploadVideo;
