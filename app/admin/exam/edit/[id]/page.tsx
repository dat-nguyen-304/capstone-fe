'use client';

import { examApi, subjectApi } from '@/api-client';
import Loader from '@/components/Loader';
import { InputText } from '@/components/form-input';
import AddQuestionModal from '@/components/test/AddQuestionModal';
import TestEditItem from '@/components/test/TestEditItem';
import { Subject } from '@/types';
// import EditExamItem from '@/components/quiz/EditExamItem';
import { Button, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCustomModal } from '@/hooks';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa6';
import { BsArrowLeft } from 'react-icons/bs';
import { BiUpArrowAlt } from 'react-icons/bi';
import * as XLSX from 'xlsx';
import { FiDelete } from 'react-icons/fi';
import { handleFileSelection, handleFileSubmitSelection } from '@/utils';
interface EditExamProps {
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
    const subjectMap: Record<number, string> = {
        1: 'MATHEMATICS',
        2: 'PHYSICS',
        3: 'CHEMISTRY',
        4: 'ENGLISH',
        5: 'BIOLOGY',
        6: 'HISTORY',
        7: 'GEOGRAPHY'
    };

    return subjectMap[id] || '';
};
const EditExam: React.FC<EditExamProps> = ({ params }) => {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [examType, setExamType] = useState<string>('PUBLIC_EXAM');
    const [questions, setQuestions] = useState<any[]>([]);
    const [editIndex, setEditIndex] = useState<number | undefined>();
    const [editQuestion, setEditQuestion] = useState<any | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [excelFile, setExcelFile] = useState(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { data: examDetail, isLoading } = useQuery<any>({
        queryKey: ['exam-detail', { params: params?.id }],
        queryFn: () => examApi.getExamById(params?.id)
    });
    const { data: topicsData } = useQuery({
        queryKey: ['topicsEditQuestionExam', { selectedSubject }],
        queryFn: () => examApi.getAllTopicBySubject(getSubjectNameById(selectedSubject), 0, 100)
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
                answerList: question?.answerList,
                level: question?.level,
                correctAnswer: question?.correctAnswer,
                imageUrl: question?.imageUrl
            }));

            setQuestions(formattedQuestions);
            setValue('name', examDetail?.name);
            setValue('description', examDetail?.description);
            setValue('duration', examDetail?.duration);
            setSelectedSubject(getSubjectIdByName(examDetail?.subject));
        }
    }, [examDetail]);

    const { onOpen: onConfirmOpen, onDanger, onWarning, onClose: onConfirmClose } = useCustomModal();

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

    const handleDeleteAllQuestions = () => {
        // Delete the question at the specified index
        onConfirmOpen();
        onDanger({
            content: 'Bạn có chắc muốn xóa toàn bộ câu hỏi',
            title: 'Xác nhận xóa toàn bộ câu hỏi',
            activeFn: () => {
                setQuestions([]);
                onConfirmClose();
            }
        });
    };

    const handleSubmitQuestions = () => {
        // Delete the question at the specified index
        onConfirmOpen();
        onWarning({
            content: 'Bạn có chắc muốn thêm toàn bộ câu hỏi trong file',
            title: 'Xác nhận tải toàn bộ câu hỏi',
            activeFn: () => {
                handleFileUpload();
                onConfirmClose();
            }
        });
    };
    const handleFileChange = (e: any) => {
        handleFileSelection(e, setExcelFile);
    };
    const handleFileUpload = () => {
        handleFileSubmitSelection(excelFile, setExcelFile, fileInputRef, topicsData, setQuestions);
    };

    const updateExam = async (formData: any) => {
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
                questionList: questions.map(({ id, ...rest }) => rest)
            };

            // Call the API to update the exam
            const response = await examApi.updateExam(params?.id, payload);
            setIsSubmitting(false);

            if (response) {
                toast.success('Cập nhật bài thi thành công');
                router.push('/admin/exam');
            }
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
                            size="sm"
                            label="Môn học"
                            color="primary"
                            isDisabled={questions?.length > 0}
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
                        <div className="col-span-1 mt-2 sm:mt-0">
                            <Select
                                isRequired
                                label="Thể loại kiểm tra"
                                color="primary"
                                variant="bordered"
                                labelPlacement="inside"
                                defaultSelectedKeys={[`${examDetail?.examType}`]}
                                onChange={event => setExamType(String(event.target.value))}
                            >
                                <SelectItem key={'PUBLIC_EXAM'} value={'PUBLIC_EXAM'}>
                                    Bài Luyện Thi
                                </SelectItem>
                                <SelectItem key={'ENTRANCE_EXAM'} value={'ENTRANCE_EXAM'}>
                                    Bài Thi Đầu Vào
                                </SelectItem>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="">
                        <Button onClick={handlePopUpAddQuestion} color="success" variant="flat" className="mt-8">
                            Thêm câu hỏi <FaPlus />
                        </Button>
                        {questions?.length > 0 && (
                            <Button
                                onClick={handleDeleteAllQuestions}
                                color="danger"
                                variant="flat"
                                className="mt-8 mx-2"
                            >
                                Xóa toàn bộ câu hỏi <FiDelete />
                            </Button>
                        )}
                    </div>

                    <div className="flex justify-center items-center">
                        <a
                            href={'/file/sample.xlsx'}
                            download={'sample.xlsx'}
                            className="mt-8 bg-green-100 hover:bg-green-300 py-3 px-4 rounded-md decoration-black text-green-500"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            Tải file mẫu
                        </a>
                        <div className="mt-8 mx-2">
                            <label htmlFor="file-input" className="sr-only">
                                Choose file
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                name="file-input"
                                id="file-input"
                                className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600
                                file:bg-gray-50 file:border-0
                                file:bg-gray-100 file:me-4
                                file:py-3 file:px-4
                                dark:file:bg-gray-700 dark:file:text-gray-400"
                                onChange={handleFileChange}
                            />
                        </div>
                        <Button
                            onClick={handleSubmitQuestions}
                            isDisabled={excelFile === null ? true : false}
                            color="success"
                            variant="flat"
                            className="mt-8"
                        >
                            Tải câu hỏi <BiUpArrowAlt />
                        </Button>
                    </div>
                </div>
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
                <Button
                    color="warning"
                    type="submit"
                    className="mt-12"
                    isLoading={isSubmitting}
                    isDisabled={questions?.length > 0 ? false : true}
                >
                    Xác nhận thay đổi
                </Button>
            </form>
        </div>
    );
};

export default EditExam;
