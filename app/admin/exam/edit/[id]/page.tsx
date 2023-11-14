'use client';

import { InputText } from '@/components/form-input';
import TestEditItem from '@/components/test/TestEditItem';
// import EditExamItem from '@/components/quiz/EditExamItem';
import { Button, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

interface EditExamProps {}

const EditExam: React.FC<EditExamProps> = () => {
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
                <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Chỉnh sửa bài thi</h3>
                <Button as={Link} href="/admin/exam" size="sm">
                    Quay lại
                </Button>
            </div>
            <div className="sm:grid grid-cols-6 my-4 gap-2">
                <div className="my-4 col-span-6 lg:col-span-3">
                    <InputText isRequired variant="bordered" name="name" size="sm" label="Tiêu đề" control={control} />
                </div>
                <div className=" my-4 col-span-3 lg:col-span-3">
                    <Select
                        isRequired
                        size="sm"
                        label="Môn học"
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
                <ul className="mt-8">
                    <TestEditItem />
                    <TestEditItem />
                    <TestEditItem />
                    <TestEditItem />
                    <TestEditItem />
                    <TestEditItem />
                    <TestEditItem />
                </ul>
                <Button variant="bordered" className="w-full font-semibold" color="primary" size="lg">
                    Thêm câu hỏi
                </Button>
            </div>
            <Button color="primary" className="mt-12">
                Xác nhận thay đổi
            </Button>
        </div>
    );
};

export default EditExam;