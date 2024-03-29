'use client';

import { examApi, subjectApi, teacherApi } from '@/api-client';
import Loader from '@/components/Loader';
import { InputText } from '@/components/form-input';
import { InputDescription } from '@/components/form-input/InputDescription';
import { InputNumber } from '@/components/form-input/InputNumber';
import { Subject } from '@/types';
import { Button, Checkbox, Input, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { courseApi } from '@/api-client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CourseRuleModal from '@/components/rule/CourseRuleModal';
interface CommonInfoProps {
    commonInfo?:
        | {
              id: number;
              name: string;
              thumbnail: string;
              level: string;
              description: string;
              price: number;
          }
        | any;
    videoOrders: { videoId: number; videoOrder: number; isDraft: boolean }[];
}

const CommonInfo: React.FC<CommonInfoProps> = ({ commonInfo, videoOrders }) => {
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState<number>(1);
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });
    const { data: teacherData } = useQuery({
        queryKey: ['teacher-detail-edit-course'],
        queryFn: () => teacherApi.getTeacherDetail()
    });
    const { control, handleSubmit, setError, setValue } = useForm({
        defaultValues: {
            name: commonInfo?.name,
            course: '',
            description: commonInfo?.description,
            price: commonInfo?.price
        }
    });
    const [isCheckedPolicy, setIsCheckPolicy] = useState(false);
    useEffect(() => {
        if (commonInfo) {
            setValue('name', commonInfo?.name);
            setValue('description', commonInfo?.description);
            setValue('price', commonInfo?.price);
            setSelectedSubject(getSubjectIdByName(commonInfo?.subject));
            setSelectedLevel(commonInfo?.level == 'Cơ bản' ? 1 : commonInfo?.level == 'Trung bình' ? 2 : 3);
        }
    }, [commonInfo]);

    const getSubjectIdByName = (subjectName: string) => {
        const foundedSubject = data?.find(subject => subject.name === subjectName);

        if (foundedSubject) {
            const { id, name } = foundedSubject;
            return id;
        }
        return 1;
    };

    const getObjectSubjectById = (id: number) => {
        const foundedSubject = data?.find(subject => subject.id === id);
        if (foundedSubject) {
            const { id, name } = foundedSubject;
            return { id, name };
        }
        return null;
    };

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
        let toastLoading;
        if (!isCheckedPolicy) toast.error('Bạn cần đồng ý với điều khoản và chính sách của CEPA');
        else
            try {
                setIsSubmitting(true);
                toastLoading = toast.loading('Đang xử lí yêu cầu');
                const formDataPayload = new FormData();
                if (uploadedFiles[0]) {
                    formDataPayload.append('thumbnail', uploadedFiles[0]);
                }

                const filteredVideoOrders = videoOrders.filter(item => item.isDraft !== undefined);
                const filteredQuizOrders = videoOrders
                    .filter(video => video.isDraft === undefined)
                    .map(video => ({ quizId: video.videoId, order: video.videoOrder }));

                if (
                    commonInfo?.status == 'DRAFT' ||
                    commonInfo?.status == 'REJECT' ||
                    commonInfo?.status == 'UPDATING'
                ) {
                    const courseTemporaryUpdateRequest = {
                        courseId: commonInfo?.id,
                        description: formData?.description,
                        name: formData?.name,
                        price: Number(formData?.price),
                        levelId: selectedLevel,
                        subject: getObjectSubjectById(selectedSubject),
                        videoOrders: filteredVideoOrders?.length > 0 ? filteredVideoOrders : null
                    };

                    formDataPayload.append(
                        'courseTemporaryUpdateRequest',
                        new Blob([JSON.stringify(courseTemporaryUpdateRequest)], { type: 'application/json' })
                    );

                    const response = await courseApi.updateDraftCourse(formDataPayload);
                    if (response) {
                        if (filteredQuizOrders?.length > 0) {
                            const res = await examApi.sortQuiz(filteredQuizOrders);
                            if (res) {
                                setIsSubmitting(false);
                                toast.success('Khóa học đã chỉnh sửa thành công');
                                router.push('/teacher/course/my-course-draft');
                            }
                        } else {
                            setIsSubmitting(false);

                            toast.success('Khóa học đã chỉnh sửa thành công');
                            router.push('/teacher/course/my-course-draft');
                        }
                    }
                } else {
                    const courseRequest = {
                        courseId: commonInfo?.id,
                        description: formData.description,
                        name: formData.name,
                        price: Number(formData.price),
                        levelId: selectedLevel,
                        videoOrders: filteredVideoOrders?.length > 0 ? filteredVideoOrders : null
                    };

                    formDataPayload.append(
                        'courseRequest',
                        new Blob([JSON.stringify(courseRequest)], { type: 'application/json' })
                    );

                    const response = await courseApi.updateCourse(formDataPayload);
                    if (response) {
                        if (filteredQuizOrders?.length > 0) {
                            const res = await examApi.sortQuiz(filteredQuizOrders);
                            if (res) {
                                setIsSubmitting(false);
                                toast.success('Khóa học đã chỉnh sửa thành công');
                                router.push('/teacher/course/my-course-draft');
                            }
                        } else {
                            setIsSubmitting(false);

                            toast.success('Khóa học đã chỉnh sửa thành công');
                            router.push('/teacher/course/my-course-draft');
                        }
                    }
                }
                toast.dismiss(toastLoading);
                // Handle the response as needed
            } catch (error) {
                setIsSubmitting(false);
                toast.dismiss(toastLoading);
                toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
                console.error('Error creating course:', error);
                // Handle error
            }
    };

    if (!data) return <Loader />;
    if (!teacherData) return <Loader />;

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
                                            <span className="text-sm">Cập nhật ảnh</span>
                                        </div>
                                    </div>
                                ) : commonInfo?.thumbnail ? (
                                    <div className="group relative">
                                        <Image
                                            className="object-cover w-full h-[240px]"
                                            key={commonInfo?.thumbnail}
                                            src={commonInfo?.thumbnail}
                                            alt={commonInfo?.thumbnail as string}
                                            width={240}
                                            height={240}
                                        />
                                        <div className="absolute top-0 right-0 bottom-0 left-0 hidden text-white group-hover:flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)]">
                                            <RiImageEditLine size={40} />
                                            <span className="text-sm">Cập nhật ảnh</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center">
                                        <RiImageAddLine size={40} />
                                        <span className="text-sm">Thêm ảnh</span>
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
                                color="primary"
                                isRequired
                            />
                        </div>
                        <div className="col-span-2">
                            <InputNumber control={control} label="Giá" name="price" />
                        </div>
                        <div className="col-span-2 sm:grid grid-cols-2 gap-4">
                            <div className="col-span-1 mt-12 md:mt-8">
                                {(commonInfo?.status == 'DRAFT' || commonInfo?.status == 'REJECT') &&
                                !commonInfo?.courseRealId ? (
                                    <Select
                                        label="Chọn môn học"
                                        isRequired
                                        color="primary"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        defaultSelectedKeys={[`${getSubjectIdByName(commonInfo?.subject)}`]}
                                        name="subject"
                                        onChange={event => setSelectedSubject(Number(event.target.value))}
                                    >
                                        {data
                                            ?.filter(subject => teacherData?.subject?.includes(subject.name))
                                            .map((subject: Subject) => (
                                                <SelectItem key={subject.id} value={subject.id}>
                                                    {subject.name}
                                                </SelectItem>
                                            ))}
                                    </Select>
                                ) : (
                                    <Input
                                        color="primary"
                                        disabled
                                        name="name"
                                        labelPlacement="outside"
                                        label="Môn học"
                                        value={commonInfo?.subject}
                                    />
                                )}
                            </div>
                            <div className="col-span-1 mt-12 md:mt-8">
                                <Select
                                    label="Mức độ"
                                    isRequired
                                    color="primary"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    defaultSelectedKeys={[
                                        `${
                                            commonInfo?.level == 'Nâng cao'
                                                ? 3
                                                : commonInfo?.level == 'Trung bình'
                                                ? 2
                                                : 1
                                        }`
                                    ]}
                                    onChange={event => setSelectedLevel(Number(event.target.value))}
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
                        <Checkbox isSelected={isCheckedPolicy} onValueChange={setIsCheckPolicy} />
                    </div>
                    <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Tôi đồng ý với{' '}
                        <a className="text-blue-600 hover:underline dark:text-blue-500" onClick={onOpen}>
                            chính sách và điều khoản của CEPA
                        </a>
                        .
                    </label>
                </div>
                <Button color="warning" type="submit" isLoading={isSubmitting}>
                    Lưu thay đổi
                </Button>
            </form>
            <CourseRuleModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </>
    );
};

export default CommonInfo;
