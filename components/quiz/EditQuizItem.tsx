'use client';

import { InputText } from '@/components/form-input';
import { InputFormula } from '@/components/form-input/InputFormula';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { useForm } from 'react-hook-form';

interface EditQuizItemProps {}

const EditQuizItem: React.FC<EditQuizItemProps> = () => {
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: ''
        }
    });
    return (
        <li className="mt-16">
            <h3 className="font-semibold text-base text-blue-700">Câu hỏi 1</h3>
            <div className="lg:grid grid-cols-2 gap-4 mt-2">
                <div>
                    <div>
                        <InputFormula name="description" control={control} placeholder="Nội dung câu hỏi..." />
                    </div>
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
                    <div className="mt-4">
                        <InputFormula name="description" control={control} placeholder="Nội dung lời giải..." />
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex items-center gap-2">
                        <InputText
                            name="a"
                            size="sm"
                            label="Đáp án A"
                            control={control}
                            className="my-2 block mt-2"
                            variant="bordered"
                        />
                        <Button variant="bordered" size="sm" color="danger">
                            Xóa
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <InputText
                            name="a"
                            size="sm"
                            label="Đáp án A"
                            control={control}
                            className="my-2 block mt-2"
                            variant="bordered"
                        />
                        <Button variant="bordered" size="sm" color="danger">
                            Xóa
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <InputText
                            name="a"
                            size="sm"
                            label="Đáp án A"
                            control={control}
                            className="my-2 block mt-2"
                            variant="bordered"
                        />
                        <Button variant="bordered" size="sm" color="danger">
                            Xóa
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <InputText
                            name="a"
                            size="sm"
                            label="Đáp án A"
                            control={control}
                            className="my-2 block mt-2"
                            variant="bordered"
                        />
                        <Button variant="bordered" size="sm" color="danger">
                            Xóa
                        </Button>
                    </div>
                    <Button className="w-full" color="primary" variant="bordered">
                        Thêm đáp án
                    </Button>
                </div>
            </div>
        </li>
    );
};

export default EditQuizItem;
