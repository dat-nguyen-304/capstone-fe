'use client';

import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { discussionApi, subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { Subject, TopicType } from '@/types';
import { useForm } from 'react-hook-form';
import { InputText } from '@/components/form-input';
import { InputFormula } from '@/components/form-input/InputFormula';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { useUser } from '@/hooks';
import NotFound from '@/app/not-found';
import { useRouter } from 'next/navigation';
interface EditPostProps {
    params: { id: number };
}

const EditPost: React.FC<EditPostProps> = ({ params }) => {
    const { user } = useUser();
    const router = useRouter();

    const { data: editDiscussion } = useQuery({
        queryKey: ['editDiscussion', { params }],
        queryFn: () => discussionApi.getDiscussionById(params?.id)
    });
    const { data: topicsData } = useQuery({
        queryKey: ['topics'],
        queryFn: () => discussionApi.getAll(0, 100),
        staleTime: Infinity
    });
    const [selectedTopic, setSelectedTopic] = useState<Number>(editDiscussion?.topicId);
    const { control, handleSubmit, setError, setValue } = useForm({
        defaultValues: {
            title: editDiscussion?.title || '',
            course: '',
            content: editDiscussion?.content || ''
        }
    });
    useEffect(() => {
        if (editDiscussion) {
            setValue('title', editDiscussion?.title);
            setValue('content', editDiscussion?.content);
            setSelectedTopic(editDiscussion?.topicId);
        }
    }, [editDiscussion]);
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
            const response = await discussionApi.updateDiscussion(
                {
                    title: formData.title,
                    topicId: Number(selectedTopic),
                    content: formData.content
                },
                params.id
            );
            if (response) {
                router.push('/discussion/my-post');
            }
            // console.log(formData.title);
            // console.log(formData.content);
            // console.log(selectedTopic);
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };
    if (user?.role !== 'STUDENT') return <NotFound />;

    if (!editDiscussion) return <Loader />;
    if (!topicsData) return <Loader />;

    return (
        <div className="w-[90%] sm:w-4/5 mx-auto my-8">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="font-bold text-xl">Chỉnh sửa bài viết</h3>
                <div className="sm:flex items-center mt-8 sm:mt-12 gap-8">
                    <InputText
                        name="title"
                        isRequired
                        label="Tên tiêu đề"
                        size="sm"
                        className="w-[100%] max-w-[360px] mb-2 sm:mb-0"
                        variant="bordered"
                        control={control}
                    />
                    <Select
                        isRequired
                        items={topicsData?.data}
                        label="Chọn chủ đề"
                        variant="bordered"
                        size="sm"
                        className="max-w-xs"
                        defaultSelectedKeys={[`${editDiscussion?.topicId}`]}
                        onChange={event => setSelectedTopic(Number(event.target.value))}
                    >
                        {(topic: TopicType) => (
                            <SelectItem key={topic.id} value={topic.id}>
                                {topic.name}
                            </SelectItem>
                        )}
                    </Select>
                </div>
                <div className="mt-6">
                    <label className="text-sm font-semibold">Nội dung bài viết</label>
                    <div className="h-[100px] w-[160px] border-2 border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer mt-4">
                        <div {...getRootProps()}>
                            <input {...getInputProps()} name="avatar" />
                            {uploadedFiles.length ? (
                                <div className="group relative">
                                    <Image
                                        className="object-cover w-full h-[100px]"
                                        key={uploadedFiles[0].path}
                                        src={URL.createObjectURL(uploadedFiles[0])}
                                        alt={uploadedFiles[0].path as string}
                                        width={160}
                                        height={100}
                                    />
                                    <div className="absolute top-0 right-0 bottom-0 left-0 hidden text-white group-hover:flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)]">
                                        <RiImageEditLine size={28} />
                                        <span className="text-sm">Cập nhật ảnh</span>
                                    </div>
                                </div>
                            ) : editDiscussion?.imageUrl ? (
                                <div className="group relative">
                                    <Image
                                        className="object-cover w-full h-[100px]"
                                        key={editDiscussion?.imageUrl}
                                        src={editDiscussion?.imageUrl}
                                        alt={editDiscussion?.imageUrl as string}
                                        width={160}
                                        height={100}
                                    />
                                    <div className="absolute top-0 right-0 bottom-0 left-0 hidden text-white group-hover:flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)]">
                                        <RiImageEditLine size={28} />
                                        <span className="text-sm">Cập nhật ảnh</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col justify-center items-center">
                                    <RiImageAddLine size={28} />
                                    <span className="text-sm">Thêm ảnh</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <InputFormula name="content" placeholder="Nội dung bài viết" control={control} />
                </div>
                <div className="flex items-start mt-16 mb-6">
                    <div className="flex items-center h-5">
                        <Checkbox />
                    </div>
                    <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Tôi đồng ý{' '}
                        <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                            với chính sách và điều khoản của CEPA.
                        </a>
                    </label>
                </div>
                <Button color="primary" type="submit">
                    Lưu thay đổi
                </Button>
            </form>
        </div>
    );
};

export default EditPost;
