'use client';

import { Button, Select, SelectItem } from '@nextui-org/react';
import { examApi } from '@/api-client';
import { CreateTopicObject } from '@/types';
import { useForm } from 'react-hook-form';
import { InputText } from '@/components/form-input';
import { useEffect, useState } from 'react';
import { useSelectedSidebar, useUser } from '@/hooks';
import NotFound from '@/app/not-found';
import { useRouter } from 'next/navigation';
import { InputDescription } from '@/components/form-input/InputDescription';
import { toast } from 'react-toastify';

interface CreateExamTopicProps {}

const CreateExamTopic: React.FC<CreateExamTopicProps> = ({}) => {
    const [level, setLevel] = useState<string>('EASY');
    const [subject, setSubject] = useState<string>('MATHEMATICS');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { user } = useUser();
    const router = useRouter();
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            description: ''
        }
    });

    const onSubmit = async (formData: CreateTopicObject) => {
        let toastLoading;
        try {
            setIsSubmitting(true);
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            const response = await examApi.createTopicExam({
                name: formData.name,
                description: formData.description,
                subject: subject,
                level: level
            });
            if (!response.data.code) {
                toast.success('Chủ đề thi đã được tạo thành công');
                router.push('/admin/exam-topic');
            }
            setIsSubmitting(false);
            toast.dismiss(toastLoading);
        } catch (error) {
            setIsSubmitting(false);
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error creating course:', error);
        }
    };
    const { onAdminKeys } = useSelectedSidebar();

    useEffect(() => {
        onAdminKeys(['10']);
    }, []);
    if (user?.role !== 'ADMIN') return <NotFound />;

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Tạo chủ đề thi</h3>
                <div className="sm:flex items-center mt-8 gap-8">
                    <InputText
                        color="primary"
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
                        isRequired
                        labelPlacement="inside"
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
                        isRequired
                        label="Mức độ"
                        color="primary"
                        variant="bordered"
                        labelPlacement="inside"
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
                <div className="mt-8">
                    <label className="text-sm font-semibold text-[#0070f0]">Mô tả chủ đề</label>
                    <InputDescription name="description" placeholder="Nội dung" control={control} />
                </div>
                <Button color="primary" type="submit" className="mt-20 sm:mt-16" isLoading={isSubmitting}>
                    Tạo bài chủ đề thi
                </Button>
            </form>
        </div>
    );
};

export default CreateExamTopic;
