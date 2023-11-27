'use client';

import { examApi, subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { InputText } from '@/components/form-input';
import { InputNumber } from '@/components/form-input/InputNumber';
import AddQuestionModal from '@/components/test/AddQuestionModal';
import TestReviewItem from '@/components/test/TestReviewItem';
import { Subject } from '@/types';
import { Button, Checkbox, Chip, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCustomModal } from '@/hooks';
import { toast } from 'react-toastify';
import { BsArrowLeft } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';
interface CreateQuizProps {}

const getSubjectNameById = (id: number): string => {
    if (id == 1) {
        return 'MATHEMATICS';
    } else if (id == 2) {
        return 'PHYSICS';
    } else if (id == 3) {
        return 'CHEMISTRY';
    } else if (id == 4) {
        return 'ENGLISH';
    } else if (id == 5) {
        return 'BIOLOGY';
    } else if (id == 6) {
        return 'HISTORY';
    } else if (id == 7) {
        return 'GEOGRAPHY';
    } else {
        return '';
    }
};

const CreateQuiz: React.FC<CreateQuizProps> = () => {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<number>(1);
    const [examType, setExamType] = useState<string>('PUBLIC_EXAM');
    const [editIndex, setEditIndex] = useState<number | undefined>();
    const [editQuestion, setEditQuestion] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { control, handleSubmit, setError, getValues } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: 'Miêu tả',
            duration: ''
        }
    });

    const { data: subjectsData, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });

    const { onOpen: onConfirmOpen, onDanger, onClose: onConfirmClose } = useCustomModal();

    const handlePopUpAddQuestion = () => {
        setEditIndex(undefined);
        setEditQuestion(null);
        onOpen();
    };

    const handleAddQuestion = (question: any) => {
        // Add the new question to the list
        setQuestions(prevQuestions => [...prevQuestions, question]);
    };

    const handleEditOpen = (index: number) => {
        setEditIndex(index);
        setEditQuestion(questions[index]);
        onOpen(); // Open the modal
    };

    const handleEditQuestion = (question: any, editIndex: number) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[editIndex] = question;
            return updatedQuestions;
        });
        setEditIndex(undefined);
        setEditQuestion(null);
    };

    const handleDeleteQuestion = (index: number) => {
        // Delete the question at the specified index
        onConfirmOpen();
        onDanger({
            content: 'Bạn có chắc muốn xóa câu hỏi',
            title: 'Xác nhận xóa câu hỏi',
            activeFn: () => {
                setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
                onConfirmClose();
            }
        });
    };

    console.log(editQuestion);
    console.log(questions);

    const createExam = async (formData: any) => {
        setIsSubmitting(true);
        const toastLoading = toast.loading('Đang xử lí yêu cầu');
        try {
            const payload = {
                name: formData?.name,
                description: formData?.description || 'Miêu Tả',
                duration: Number(formData?.duration || 60),
                courseId: -1,
                subject: getSubjectNameById(selectedSubject),
                examType: examType,
                questionList: questions
            };
            console.log(payload);

            // Call the API to create the exam
            const response = await examApi.createExam(payload);
            setIsSubmitting(false);
            toast.dismiss(toastLoading);
            toast.success('Tạo bài thi thành công');

            if (response) {
                router.push('/admin/exam');
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error('Error creating exam:', error);
        }
    };

    if (!subjectsData) return <Loader />;

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <form onSubmit={handleSubmit(createExam)}>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Chỉnh sửa bài thi</h3>
                    <Button variant="flat" onClick={() => router.back()} size="sm">
                        <BsArrowLeft /> Quay lại
                    </Button>
                </div>
                <div className="sm:grid grid-cols-6 my-4 gap-2">
                    <div className="my-4 col-span-6 lg:col-span-3">
                        <InputText
                            color="primary"
                            isRequired
                            variant="bordered"
                            name="name"
                            size="sm"
                            label="Tiêu đề"
                            control={control}
                        />
                    </div>
                    <div className="my-4 col-span-3 lg:col-span-3">
                        <Select
                            size="sm"
                            isRequired
                            isDisabled={questions?.length > 0}
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
                    <div className="col-span-3 lg:col-span-3">
                        <InputText
                            isRequired
                            color="primary"
                            variant="bordered"
                            name="duration"
                            size="sm"
                            label="Thời gian (phút)"
                            control={control}
                        />
                    </div>
                    <div className="col-span-3 lg:col-span-3">
                        <Select
                            isRequired
                            className="md:mt-0 mt-8"
                            label="Thể loại kiểm tra"
                            color="primary"
                            variant="bordered"
                            labelPlacement="inside"
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
                <Button onClick={handlePopUpAddQuestion} color="success" variant="flat" className="mt-8">
                    Thêm câu hỏi <FaPlus />
                </Button>
                <AddQuestionModal
                    isOpen={isOpen}
                    onClose={onClose}
                    onAddQuestion={handleAddQuestion}
                    subject={getSubjectNameById(selectedSubject)}
                    editIndex={editIndex}
                    editQuestion={editQuestion}
                    onEditQuestion={handleEditQuestion}
                />
                <ul className="mt-8">
                    {questions?.map((question, index) => (
                        <div key={index}>
                            <TestReviewItem
                                questions={question}
                                index={index}
                                handleEditOpen={handleEditOpen}
                                handleDeleteQuestion={handleDeleteQuestion}
                            />
                            {/* Add a delete button for each question */}
                        </div>
                    ))}
                </ul>
                {questions && questions.length > 4 && (
                    <Button
                        onClick={handlePopUpAddQuestion}
                        className="w-full mt-2 font-semibold"
                        color="success"
                        variant="flat"
                        size="lg"
                    >
                        Thêm câu hỏi <FaPlus />
                    </Button>
                )}

                <Button className="mt-12" type="submit" color="primary" isLoading={isSubmitting}>
                    Tạo bài thi mới
                </Button>
            </form>
        </div>
    );
};

export default CreateQuiz;
