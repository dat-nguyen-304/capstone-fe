'use client';

import { InputText } from '@/components/form-input';
import EditQuizItem from '@/components/quiz/EditQuizItem';
import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

interface EditQuizProps {}

const EditQuiz: React.FC<EditQuizProps> = () => {
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: ''
        }
    });

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <div className="flex justify-between items-center">
                <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Chỉnh sửa bài tập</h3>
                <Button as={Link} href="/teacher/quiz/my-quiz" size="sm">
                    Quay lại
                </Button>
            </div>
            <div className="sm:grid grid-cols-6 my-4 gap-2">
                <div className="my-4 col-span-6 lg:col-span-2">
                    <InputText variant="bordered" name="name" size="sm" label="Tiêu đề" control={control} />
                </div>
                <div className=" my-4 col-span-3 lg:col-span-2">
                    <Select size="sm" label="Khóa học" color="primary" variant="bordered" defaultSelectedKeys={['0']}>
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
                <div className=" my-4 col-span-3 lg:col-span-2">
                    <Select size="sm" label="Thêm vào" color="primary" variant="bordered" defaultSelectedKeys={['0']}>
                        <SelectItem key={0} value={0}>
                            Cuối danh sách
                        </SelectItem>
                        <SelectItem key={1} value={1}>
                            Đầu danh sách
                        </SelectItem>
                    </Select>
                </div>
            </div>
            <div>
                <ul>
                    <EditQuizItem />
                    <EditQuizItem />
                    <EditQuizItem />
                    <EditQuizItem />
                </ul>
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
            <Button color="primary">Tạo khóa bài tập mới</Button>
        </div>
    );
};

export default EditQuiz;
