'use client';

import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { examApi, subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { CreateTopicObject, Subject } from '@/types';
import { useForm } from 'react-hook-form';
import { InputText } from '@/components/form-input';
import { InputFormula } from '@/components/form-input/InputFormula';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { useUser } from '@/hooks';
import NotFound from '@/app/not-found';
import { discussionApi } from '@/api-client';
import { useRouter } from 'next/navigation';
interface CreateExamTopicProps {}

const CreateExamTopic: React.FC<CreateExamTopicProps> = ({}) => {
    const [level, setLevel] = useState<string>('EASY');
    const [subject, setSubject] = useState<string>('MATHEMATICS');
    const { user } = useUser();
    const router = useRouter();
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            description: ''
        }
    });

    const onSubmit = async (formData: CreateTopicObject) => {
        try {
            const response = await examApi.createTopicExam({
                name: formData.name,
                description: formData.description,
                subject: subject,
                level: level
            });
            if (!response.data.code) {
                router.push('/admin/exam-topic');
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    if (user?.role !== 'ADMIN') return <NotFound />;

    return (
        <div className="w-[90%] sm:w-4/5 mx-auto my-8">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="font-bold text-xl">Tạo chủ đề thi</h3>
                <div className="sm:flex items-center mt-8 sm:mt-12 gap-8">
                    <InputText
                        name="name"
                        isRequired
                        label="Tên tiêu đề"
                        size="sm"
                        className="w-[100%] max-w-[360px] mb-2 sm:mb-0"
                        variant="bordered"
                        control={control}
                    />
                    <Select
                        label="Môn học"
                        color="primary"
                        variant="bordered"
                        labelPlacement="outside"
                        defaultSelectedKeys={['MATHEMATICS']}
                        onChange={event => setSubject(String(event.target.value))}
                    >
                        <SelectItem key={'MATHEMATICS'} value={'MATHEMATICS'}>
                            Toán học
                        </SelectItem>
                        <SelectItem key={'PHYSICS'} value={'PHYSICS'}>
                            Vật lý
                        </SelectItem>
                        <SelectItem key={'CHEMISTRY'} value={'CHEMISTRY'}>
                            Hóa học
                        </SelectItem>
                        <SelectItem key={'ENGLISH'} value={'ENGLISH'}>
                            Tiếng anh
                        </SelectItem>
                        <SelectItem key={'BIOLOGY'} value={'BIOLOGY'}>
                            Sinh học
                        </SelectItem>
                        <SelectItem key={'HISTORY'} value={'HISTORY'}>
                            Lịch sử
                        </SelectItem>
                        <SelectItem key={'GEOGRAPHY'} value={'GEOGRAPHY'}>
                            Địa lý
                        </SelectItem>
                    </Select>
                    <Select
                        label="Mức độ"
                        color="primary"
                        variant="bordered"
                        labelPlacement="outside"
                        defaultSelectedKeys={['EASY']}
                        onChange={event => setLevel(String(event.target.value))}
                    >
                        <SelectItem key={'EASY'} value={'EASY'}>
                            Cơ bản
                        </SelectItem>
                        <SelectItem key={'MEDIUM'} value={'MEDIUM'}>
                            Trung bình
                        </SelectItem>
                        <SelectItem key={'HARD'} value={'HARD'}>
                            Nâng cao
                        </SelectItem>
                    </Select>
                </div>
                <div className="mt-6">
                    <label className="text-sm font-semibold">Nội dung bài viết</label>

                    <InputFormula name="description" placeholder="Nội dung bài viết" control={control} />
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
                    Tạo bài chủ đề thi
                </Button>
            </form>
        </div>
    );
};

export default CreateExamTopic;
