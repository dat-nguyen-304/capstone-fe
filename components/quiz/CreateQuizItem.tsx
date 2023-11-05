'use client';

import { InputText } from '@/components/form-input';
import { InputDescription } from '@/components/form-input/InputDescription';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { useForm } from 'react-hook-form';

interface CreateQuizItemProps {}

const CreateQuizItem: React.FC<CreateQuizItemProps> = () => {
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: ''
        }
    });
    return (
        <li className="mt-8">
            <h3 className="font-semibold text-base text-blue-700">Câu hỏi 1</h3>
            <div className="lg:grid grid-cols-2 gap-4 mt-2">
                <div>
                    <InputDescription name="description" control={control} placeholder="Nội dung câu hỏi..." />
                    <Select
                        size="sm"
                        label="Đáp án đúng"
                        color="primary"
                        variant="bordered"
                        defaultSelectedKeys={['a']}
                        className="mt-16 w-[160px]"
                    >
                        <SelectItem key="a" value="a">
                            A
                        </SelectItem>
                        <SelectItem key="b" value="b">
                            B
                        </SelectItem>
                        <SelectItem key="c" value="c">
                            C
                        </SelectItem>
                        <SelectItem key="d" value="d">
                            D
                        </SelectItem>
                    </Select>
                </div>
                <div className="w-full">
                    <InputText
                        name="name"
                        size="sm"
                        label="Đáp án A"
                        control={control}
                        className="my-2 block mt-2"
                        variant="bordered"
                        labelPlacement="outside-left"
                    />
                    <InputText
                        name="name"
                        size="sm"
                        label="Đáp án B"
                        control={control}
                        className="my-2 block mt-2"
                        variant="bordered"
                        labelPlacement="outside-left"
                    />
                    <InputText
                        name="name"
                        size="sm"
                        label="Đáp án C"
                        control={control}
                        className="my-2 block mt-2"
                        variant="bordered"
                        labelPlacement="outside-left"
                    />
                    <InputText
                        name="name"
                        size="sm"
                        label="Đáp án D"
                        control={control}
                        className="my-2 block mt-2"
                        variant="bordered"
                        labelPlacement="outside-left"
                    />
                    <Button className="w-full">Thêm đáp án</Button>
                </div>
            </div>
        </li>
    );
};

export default CreateQuizItem;
