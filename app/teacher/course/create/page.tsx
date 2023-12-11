'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Select, SelectItem, Skeleton, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import { subjectApi, topicApi, courseApi, teacherApi } from '@/api-client';
import { Subject, Topic } from '@/types';
import { InputText } from '@/components/form-input';
import { InputDescription } from '@/components/form-input/InputDescription';
import Loader from '@/components/Loader';
import { InputNumber } from '@/components/form-input/InputNumber';
import { useDropzone, FileWithPath, DropzoneRootProps } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { createSkeletonArray } from '@/utils';
import { toast } from 'react-toastify';
import CourseRuleModal from '@/components/rule/CourseRuleModal';

const CreateCourse: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState<number>(1);
    const [topicStates, setTopicStates] = useState<(Topic & { isSelected: boolean })[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[]>([]);
    const [levelId, setLevelId] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isCheckedPolicy, setIsCheckPolicy] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: '',
            subject: ''
        }
    });

    const router = useRouter();
    const { data: subjectsData, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });

    const { data: teacherData } = useQuery({
        queryKey: ['teacher-detail'],
        queryFn: () => teacherApi.getTeacherDetail()
    });

    const { data: topics } = useQuery({
        queryKey: ['topics', { selectedSubject }],
        queryFn: () => (selectedSubject !== 0 ? topicApi.getTopicsBySubject(selectedSubject) : [])
    });

    const defaultSubjectIds: number[] =
        subjectsData?.filter(subject => teacherData?.subject?.includes(subject.name)).map(subject => subject.id) ?? [];
    useEffect(() => {
        if (teacherData) {
            const defaultSubjectIds: number[] =
                subjectsData
                    ?.filter(subject => teacherData?.subject?.includes(subject.name))
                    .map(subject => subject.id) ?? [];
            setSelectedSubject(defaultSubjectIds[0]);
        }
    }, [teacherData]);
    useEffect(() => {
        if (topics) {
            const newTopics = topics.map(topic => {
                return {
                    ...topic,
                    isSelected: false
                };
            });
            setTopicStates(newTopics);
        }
    }, [topics]);

    const getObjectSubjectById = (id: number) => {
        const foundedSubject = subjectsData?.find(subject => subject.id === id);
        if (foundedSubject) {
            const { id, name } = foundedSubject;
            return { id, name };
        }
        return null;
    };

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

    const addTopic = (topic: Topic) => {
        const newTopicStates = [...topicStates];
        setTopicStates(
            newTopicStates.map(t => {
                return topic.id === t.id ? { ...t, isSelected: !t.isSelected } : t;
            })
        );
    };

    const skeletonArray = createSkeletonArray(20);

    const onSubmit = async (formData: any) => {
        let toastLoading;
        if (!isCheckedPolicy) toast.error('Bạn cần đồng ý với điều khoản và chính sách của CEPA');
        else if (uploadedFiles[0] === undefined) {
            toast.error('Bạn cần chọn thumnail cho khóa học');
        } else {
            try {
                const selectedTopics = topicStates
                    .filter(topic => {
                        return topic.isSelected;
                    })
                    .map(topic => {
                        return { id: topic.id, name: topic.name };
                    });
                if (selectedTopics?.length == 0) {
                    toast.error('Bạn cần chọn chủ đề cho khóa học');
                } else {
                    setIsSubmitting(true);
                    toastLoading = toast.loading('Đang xử lí yêu cầu');
                    const courseRequest = {
                        description: formData.description,
                        name: formData.name,
                        price: formData.price,
                        subject: getObjectSubjectById(selectedSubject),
                        levelId: levelId,
                        topic: selectedTopics
                    };

                    const formDataPayload = new FormData();
                    formDataPayload.append(
                        'courseRequest',
                        new Blob([JSON.stringify(courseRequest)], { type: 'application/json' })
                    );
                    formDataPayload.append('thumbnail', uploadedFiles[0]);

                    const response = await courseApi.createCourse(formDataPayload);
                    if (response) {
                        setIsSubmitting(false);
                        toast.success('Khóa học đã được tạo thành công');

                        router.push('/teacher/course/my-course-draft');
                    }
                    toast.dismiss(toastLoading);
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

    if (!subjectsData) return <Loader />;
    if (!teacherData) return <Loader />;

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Tạo khóa học mới</h3>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="md:grid grid-cols-6 mt-8">
                    <div className="md:col-span-3 lg:col-span-2">
                        <label className="font-semibold block mb-2 text-[#1877f1]">Ảnh thu nhỏ</label>
                        <div className="h-[240px] border-2 border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer">
                            <div {...getRootProps()}>
                                <input {...getInputProps()} name="avatar" />
                                {uploadedFiles.length > 0 ? (
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
                                color="primary"
                                isRequired
                                labelPlacement="outside"
                                label="Tên khóa học"
                                control={control}
                            />
                        </div>
                        <div className="col-span-2 sm:grid grid-cols-2 gap-4">
                            <div className="col-span-1 mt-12 md:mt-8">
                                <Select
                                    label="Chọn môn học"
                                    isRequired
                                    color="primary"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    defaultSelectedKeys={[`${defaultSubjectIds[0]}`]}
                                    // value={selectedSubject}
                                    description="Bạn không thể thay đổi môn học sau khi đã tạo khóa học."
                                    name="subject"
                                    onChange={event => setSelectedSubject(Number(event.target.value))}
                                >
                                    {subjectsData
                                        .filter(subject => teacherData?.subject?.includes(subject.name))
                                        .map((subject: Subject) => (
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
                                    isRequired
                                    description="Mức độ khó của khóa học"
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
                        <div className="col-span-2 sm:grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <InputNumber control={control} label="Giá" name="price" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <label className="font-semibold text-[#1877f1]">Chủ đề khóa học</label>
                    {topics ? (
                        <ul className="mt-4 flex gap-2 flex-wrap">
                            {topicStates.map(topic => (
                                <li
                                    key={topic.id}
                                    onClick={() => addTopic(topic)}
                                    className={`${
                                        topic.isSelected ? 'bg-blue-200 border-blue-700' : 'border-gray-400'
                                    } border-2 rounded-lg py-1 px-2 cursor-pointer`}
                                >
                                    {topic.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex gap-3 mt-8 flex-wrap">
                            {skeletonArray.map(i => (
                                <Skeleton key={i} isLoaded={false} className="rounded-lg">
                                    <li className="w-[60px] sm:w-[80px] h-[32px] rounded-lg px-2 py-2 sm:py-4 sm:px-4"></li>
                                </Skeleton>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <label className="font-semibold text-[#1877f1]">Mô tả</label>
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
                <Button color="primary" type="submit" isLoading={isSubmitting}>
                    Tạo bản nháp
                </Button>
            </form>
            <CourseRuleModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </div>
    );
};

export default CreateCourse;
