'use client';

import { InputText } from '@/components/form-input';
import AddQuestionModal from '@/components/test/AddQuestionModal';
import { Button, Checkbox, Chip, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { useForm } from 'react-hook-form';

interface CreateQuizProps {}

const CreateQuiz: React.FC<CreateQuizProps> = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: ''
        }
    });

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Tạo khóa bài tập mới</h3>
            <div className="sm:grid grid-cols-6 my-4 gap-2">
                <div className="my-4 col-span-6 lg:col-span-3">
                    <InputText
                        isRequired
                        variant="bordered"
                        name="name"
                        color="primary"
                        size="sm"
                        label="Tiêu đề"
                        control={control}
                    />
                </div>
                <div className=" my-4 col-span-3 lg:col-span-3">
                    <Select
                        size="sm"
                        isRequired
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
            </div>
            <div>
                <label className="font-semibold text-base text-[#444]">Chủ đề</label>
                <ul className="mt-4 flex flex-wrap gap-2">
                    <li>
                        <Chip variant="bordered">abc</Chip>
                    </li>
                    <li>
                        <Chip variant="bordered">abc</Chip>
                    </li>
                </ul>
            </div>
            <Button onClick={onOpen} color="primary" className="mt-8">
                Thêm câu hỏi
            </Button>
            {/* <AddQuestionModal isOpen={isOpen} onClose={onClose} /> */}
            <div>
                <ul></ul>
                <Button className="w-full mt-16 font-semibold" color="primary" size="lg">
                    Thêm câu hỏi
                </Button>
            </div>
            <div className="flex items-start mb-4 mt-8 sm:mt-12">
                <div className="flex items-center h-5">
                    <Checkbox />
                </div>
                <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Tôi đồng ý với{' '}
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                        chính sách và điều khoản của CEPA
                    </a>
                    .
                </label>
            </div>
            <Button color="primary">Tạo bài tập mới</Button>
        </div>
    );
};

export default CreateQuiz;
