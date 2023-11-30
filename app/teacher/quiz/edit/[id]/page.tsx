'use client';

import { courseApi, examApi, subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { InputText } from '@/components/form-input';
import AddQuestionModal from '@/components/test/AddQuestionModal';
import TestEditItem from '@/components/test/TestEditItem';
import { Course, Subject } from '@/types';
// import EditExamItem from '@/components/quiz/EditExamItem';
import { Button, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCustomModal } from '@/hooks';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa6';
import { BsArrowLeft } from 'react-icons/bs';
interface EditQuizProps {
    params: { id: number };
}
const getSubjectIdByName = (subjectName: string): number => {
    if (subjectName == 'MATHEMATICS') {
        return 1;
    } else if (subjectName == 'PHYSICS') {
        return 2;
    } else if (subjectName == 'CHEMISTRY') {
        return 3;
    } else if (subjectName == 'ENGLISH') {
        return 4;
    } else if (subjectName == 'BIOLOGY') {
        return 5;
    } else if (subjectName == 'HISTORY') {
        return 6;
    } else if (subjectName == 'GEOGRAPHY') {
        return 7;
    } else {
        return 0;
    }
};
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
const EditQuiz: React.FC<EditQuizProps> = ({ params }) => {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [questions, setQuestions] = useState<any[]>([]);
    const [editIndex, setEditIndex] = useState<number | undefined>();
    const [editQuestion, setEditQuestion] = useState<any | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedCourse, setSelectedCourse] = useState<number>();
    const { data: examDetail, isLoading } = useQuery<any>({
        queryKey: ['exam-detail', { params: params?.id }],
        queryFn: () => examApi.getExamById(params?.id)
    });
    const {
        status,
        error,
        data: subjectsData,
        isPreviousData
    } = useQuery({
        queryKey: ['subjects'],
        queryFn: () => subjectApi.getAll(),
        staleTime: Infinity
    });
    const { data: coursesData } = useQuery({
        queryKey: ['coursesList'],
        queryFn: () => courseApi.getAllOfTeacher(0, 100, 'createdDate', 'DESC')
    });
    const { control, handleSubmit, setError, setValue } = useForm({
        defaultValues: {
            name: examDetail?.name || '',
            course: '',
            description: examDetail?.description || '',
            duration: examDetail?.duration || ''
        }
    });

    useEffect(() => {
        if (examDetail) {
            const formattedQuestions = examDetail?.questionList?.map((question: any) => ({
                statement: question?.statement,
                explanation: question?.explanation,
                topicId: question?.topic?.id, // Assuming `topic` is an object with an `id` property
                level: question?.level, // Assuming `topic` is an object with an `id` property
                answerList: question?.answerList,
                correctAnswer: question?.correctAnswer
            }));
            setSelectedCourse(examDetail?.courseId);
            setQuestions(formattedQuestions);
            setValue('name', examDetail?.name);
            setValue('description', examDetail?.description);
            setValue('duration', examDetail?.duration);
            setSelectedSubject(getSubjectIdByName(examDetail?.subject));
        }
    }, [examDetail]);

    const { onOpen: onConfirmOpen, onDanger, onClose: onConfirmClose } = useCustomModal();

    const handleEditQuestion = (editedQuestion: any, index: number) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[index] = editedQuestion;
            return updatedQuestions;
        });
    };
    const handlePopUpAddQuestion = () => {
        setEditIndex(undefined);
        setEditQuestion(null);
        onOpen();
    };
    const handleAddQuestion = (question: any) => {
        // Add the new question to the list
        setQuestions(prevQuestions => [...prevQuestions, question]);
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
    const updateExam = async (formData: any) => {
        setIsSubmitting(true);
        const toastLoading = toast.loading('Đang xử lí yêu cầu');
        try {
            const payload = {
                name: formData?.name,
                description: formData?.description || 'Miêu Tả',
                duration: Number(formData?.duration || 60),
                courseId: selectedCourse,
                subject: getSubjectNameById(selectedSubject),
                examType: 'QUIZ',
                questionList: questions.map(({ id, ...rest }) => rest)
            };
            console.log(payload);

            // Call the API to update the exam
            const response = await examApi.updateExam(params?.id, payload);

            if (response) {
                toast.success('Cập nhật bài quiz thành công');
                router.push('/teacher/quiz');
            }
            setIsSubmitting(false);
            toast.dismiss(toastLoading);
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');

            // Handle any errors that occur during the API call
            setIsSubmitting(false);
            console.error('Error creating exam:', error);
            // You can also show a user-friendly error message
        }
    };

    if (!subjectsData) return <Loader />;
    if (!examDetail) return <Loader />;
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <form onSubmit={handleSubmit(updateExam)}>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Chỉnh sửa bài thi</h3>
                    <Button variant="faded" onClick={() => router.back()} size="sm">
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
                            isRequired
                            isDisabled={questions?.length > 0}
                            size="sm"
                            label="Môn học"
                            color="primary"
                            variant="bordered"
                            defaultSelectedKeys={[`${getSubjectIdByName(examDetail?.subject)}`]}
                        >
                            {subjectsData.map((subject: Subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className="col-span-6 sm:grid grid-cols-2 gap-4">
                        <div className="col-span-1 mt-1">
                            <InputText
                                color="primary"
                                isRequired
                                variant="bordered"
                                name="duration"
                                size="sm"
                                label="Thời gian (phút)"
                                control={control}
                            />
                        </div>
                        <div className="col-span-1 mt-1">
                            <Select
                                isRequired
                                size="sm"
                                label="Khóa học"
                                color="primary"
                                variant="bordered"
                                defaultSelectedKeys={[`${examDetail?.courseId}`]}
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
                <div>
                    <ul className="mt-8">
                        {questions?.map((question, index) => (
                            <div key={index}>
                                <TestEditItem
                                    questions={question}
                                    index={index}
                                    onEdit={handleEditQuestion}
                                    subjectId={selectedSubject}
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
                </div>
                <Button color="primary" type="submit" className="mt-12" isLoading={isSubmitting}>
                    Xác nhận thay đổi
                </Button>
            </form>
        </div>
    );
};

export default EditQuiz;
