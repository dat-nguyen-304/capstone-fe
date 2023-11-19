'use client';

import { subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { InputText } from '@/components/form-input';
import { InputNumber } from '@/components/form-input/InputNumber';
import AddQuestionModal from '@/components/test/AddQuestionModal';
import { Subject } from '@/types';
import { Button, Checkbox, Chip, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface CreateQuizProps {}

const CreateQuiz: React.FC<CreateQuizProps> = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<number>(1);
    const [level, setLevel] = useState<string>('EASY');
    const [examType, setExamType] = useState<string>('PUBLIC_EXAM');
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: '',
            duration: ''
        }
    });
    const { data: subjectsData, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });
    if (!subjectsData) return <Loader />;
    const handleAddQuestion = (question: any) => {
        // Add the new question to the list
        setQuestions(prevQuestions => [...prevQuestions, question]);
    };
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Tạo đề thi mới</h3>
            <div className="sm:grid grid-cols-6 my-4 gap-2">
                <div className="my-4 col-span-6 lg:col-span-3">
                    <InputText isRequired variant="bordered" name="name" size="sm" label="Tiêu đề" control={control} />
                </div>
                <div className=" my-4 col-span-3 lg:col-span-3">
                    <Select
                        size="sm"
                        isRequired
                        label="Môn học"
                        color="primary"
                        variant="bordered"
                        defaultSelectedKeys={['1']}
                        value={selectedSubject}
                        name="subject"
                        onChange={event => setSelectedSubject(Number(event.target.value))}
                    >
                        {subjectsData.map((subject: Subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className="col-span-6 sm:grid grid-cols-3 gap-4">
                    <div className="col-span-1 mt-1">
                        <InputText
                            isRequired
                            variant="bordered"
                            name="duration"
                            size="sm"
                            label="Thời gian"
                            control={control}
                        />
                    </div>

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
                    <Select
                        label="Thể loại kiểm tra"
                        color="primary"
                        variant="bordered"
                        labelPlacement="outside"
                        defaultSelectedKeys={['PUBLIC_EXAM']}
                        onChange={event => setExamType(String(event.target.value))}
                    >
                        <SelectItem key={'PUBLIC_EXAM'} value={'PUBLIC_EXAM'}>
                            Bài Kiểm Tra
                        </SelectItem>
                        <SelectItem key={'ENTRANCE_EXAM'} value={'ENTRANCE_EXAM'}>
                            Bài Thi Đầu Vào
                        </SelectItem>
                    </Select>
                </div>
            </div>
            <Button onClick={onOpen} color="primary" className="mt-8">
                Thêm câu hỏi
            </Button>
            <AddQuestionModal isOpen={isOpen} onClose={onClose} onAddQuestion={handleAddQuestion} />
            <div>
                <ul>
                    {/* Display the list of questions */}
                    {questions.map((question, index) => (
                        <li key={index}>{question.questionContent}</li>
                    ))}
                </ul>
                <Button onClick={onOpen} className="w-full mt-16 font-semibold" color="primary" size="lg">
                    Thêm câu hỏi
                </Button>
            </div>
            <Button className="mt-8" color="primary">
                Tạo bài thi mới
            </Button>
        </div>
    );
};

export default CreateQuiz;
