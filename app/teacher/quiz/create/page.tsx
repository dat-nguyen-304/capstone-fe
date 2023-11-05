'use client';

import { InputText } from '@/components/form-input';
import CreateQuizItem from '@/components/quiz/CreateQuizItem';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { useForm } from 'react-hook-form';

interface CreateQuizProps {}

const CreateQuiz: React.FC<CreateQuizProps> = () => {
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
                    <CreateQuizItem />
                    <CreateQuizItem />
                    <CreateQuizItem />
                    <CreateQuizItem />
                </ul>
                <Button className="w-full mt-4 font-semibold" size="lg">
                    Thêm câu hỏi
                </Button>
            </div>
        </div>
    );
};

export default CreateQuiz;
