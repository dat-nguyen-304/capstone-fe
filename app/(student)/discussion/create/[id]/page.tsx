'use client';

import { Button, Checkbox, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { discussionApi, subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { Subject, TopicType } from '@/types';
import { useForm } from 'react-hook-form';
import { InputText } from '@/components/form-input';
import { InputFormula } from '@/components/form-input/InputFormula';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { useUser } from '@/hooks';
import NotFound from '@/app/not-found';
import { CreateDiscussion } from '@/types/discussion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import DiscussionRuleModal from '@/components/rule/DiscussionRuleModal';
interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
    const { user } = useUser();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isCheckedPolicy, setIsCheckPolicy] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { control, handleSubmit, setError, getValues } = useForm({
        defaultValues: {
            title: '',
            content: ''
        }
    });
    const [selectedTopic, setSelectedTopic] = useState<Number>(1);
    const { data } = useQuery({
        queryKey: ['topics'],
        queryFn: () => discussionApi.getAll(0, 100)
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
        let toastLoading;
        if (!isCheckedPolicy) toast.error('Bạn cần đồng ý với điều khoản và chính sách của CEPA');
        else if (formData?.content == '') {
            toast.error('Bạn cần nhập nội dung bài đăng');
        } else {
            try {
                toastLoading = toast.loading('Đang tạo bài đăng');
                setIsSubmitting(true);
                const formDataWithImage = new FormData();
                formDataWithImage.append('title', formData.title);
                formDataWithImage.append('topicId', selectedTopic.toString());
                formDataWithImage.append('content', formData.content);
                if (uploadedFiles.length > 0) {
                    formDataWithImage.append('image', uploadedFiles[0]); // assuming 'image' is the field name expected by the server
                }
                const response = await discussionApi.createDiscussion(formDataWithImage);
                if (response) {
                    toast.dismiss(toastLoading);
                    toast.success('Tạo bài đăng thành công');
                    setIsSubmitting(false);
                    router.push('/discussion/my-post');
                }
            } catch (error) {
                toast.dismiss(toastLoading);
                setIsSubmitting(false);
                toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
                console.error('Error creating course:', error);
            }
        }
    };

    if (user?.role !== 'STUDENT') return <NotFound />;

    if (!data) return <Loader />;

    return (
        <div className="w-[90%] sm:w-4/5 mx-auto my-8">
            <form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <h3 className="font-bold text-xl text-blue-500">Tạo bài đăng</h3>
                <div className="sm:flex items-center mt-8 sm:mt-12 gap-8">
                    <InputText
                        color="primary"
                        name="title"
                        isRequired
                        label="Tên tiêu đề"
                        size="sm"
                        className="w-[100%] max-w-[360px] mb-2 sm:mb-0"
                        variant="bordered"
                        control={control}
                    />
                    <Select
                        color="primary"
                        isRequired
                        items={data?.data}
                        label="Chọn chủ đề"
                        variant="bordered"
                        size="sm"
                        className="max-w-xs"
                        defaultSelectedKeys={[`${selectedTopic}`]}
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
                    <label className="text-sm font-semibold text-blue-500">Nội dung bài đăng</label>
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
                            ) : (
                                <div className="flex flex-col justify-center items-center">
                                    <RiImageAddLine size={28} />
                                    <span className="text-sm">Thêm ảnh</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <InputFormula name="content" placeholder="Nội dung bài đăng" control={control} />
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
                    Tạo bài đăng
                </Button>
            </form>
            <DiscussionRuleModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </div>
    );
};

export default CreatePost;
