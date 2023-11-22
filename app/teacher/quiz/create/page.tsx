'use client';

import { courseApi, examApi, subjectApi, topicApi } from '@/api-client';
import Loader from '@/components/Loader';
import { InputText } from '@/components/form-input';
import AddQuestionModal from '@/components/test/AddQuestionModal';
import { Course, Subject, Topic } from '@/types';
import { Button, Checkbox, Chip, Select, SelectItem, useDisclosure, Skeleton } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSkeletonArray } from '@/utils';
import TestReviewItem from '@/components/test/TestReviewItem';
import { useRouter } from 'next/navigation';
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
    const [selectedCourse, setSelectedCourse] = useState<number>();
    const [editIndex, setEditIndex] = useState<number | undefined>();
    const [editQuestion, setEditQuestion] = useState<any | null>(null);
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: '',
            duration: ''
        }
    });

    const { data: subjectsData, isLoading } = useQuery({
        queryKey: ['subjectsQuiz'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });
    const { data: coursesData } = useQuery({
        queryKey: ['coursesList'],
        queryFn: () => courseApi.getAllOfTeacher(0, 100)
    });
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
        setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
    };
    const createQuiz = async (formData: any) => {
        try {
            const payload = {
                name: formData?.name,
                description: formData?.description || 'Miêu Tả',
                duration: Number(formData?.duration || 60),
                courseId: selectedCourse,
                subject: getSubjectNameById(selectedSubject),
                examType: 'PRIVATE_EXAM',
                questionList: questions
            };
            console.log(payload);

            // Call the API to create the exam
            const response = await examApi.createExam(payload);

            if (response) {
                router.push('/teacher/quiz');
            }
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error('Error creating exam:', error);
            // You can also show a user-friendly error message
        }
    };
    if (!subjectsData) return <Loader />;
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Tạo khóa bài tập mới</h3>
            <div className="sm:grid grid-cols-6 my-4 gap-3">
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
            </div>
            <div className="sm:grid grid-cols-6 my-4 gap-3">
                <div className="my-4 col-span-3 lg:col-span-3">
                    <InputText
                        isRequired
                        variant="bordered"
                        name="duration"
                        size="sm"
                        label="Thời gian"
                        control={control}
                    />
                </div>
                <div className="my-4 col-span-3 lg:col-span-3">
                    <Select
                        isRequired
                        size="sm"
                        label="Khóa học"
                        color="primary"
                        variant="bordered"
                        onChange={event => setSelectedCourse(Number(event.target.value))}
                    >
                        {coursesData?.data?.map((course: Course) => (
                            <SelectItem key={course?.id} value={course?.id}>
                                {course?.courseName}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>
            <Button onClick={handlePopUpAddQuestion} color="primary" className="mt-8">
                Thêm câu hỏi
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
            <div>
                <ul className="mt-8">
                    {questions?.map((question, index) => (
                        <div key={index}>
                            <TestReviewItem questions={question} index={index} />
                            {/* Add a delete button for each question */}
                            <Button
                                onClick={() => handleEditOpen(index)}
                                className="mx-2"
                                color="warning"
                                size="sm"
                                variant="bordered"
                            >
                                Chỉnh sửa
                            </Button>
                            <Button
                                onClick={() => handleDeleteQuestion(index)}
                                className=""
                                color="danger"
                                size="sm"
                                variant="bordered"
                            >
                                Xóa câu hỏi
                            </Button>
                        </div>
                    ))}
                </ul>
                <Button
                    className="w-full mt-16 font-semibold"
                    color="primary"
                    size="lg"
                    onClick={handlePopUpAddQuestion}
                >
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
