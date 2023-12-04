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
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCustomModal } from '@/hooks';
import { toast } from 'react-toastify';
import { BsArrowLeft } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';
import * as XLSX from 'xlsx';
import { FiDelete } from 'react-icons/fi';
import { BiUpArrowAlt } from 'react-icons/bi';
interface CreateQuizProps {}

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
const CreateQuiz: React.FC<CreateQuizProps> = () => {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<number>(1);
    const [examType, setExamType] = useState<string>('PUBLIC_EXAM');
    const [editIndex, setEditIndex] = useState<number | undefined>();
    const [editQuestion, setEditQuestion] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [excelFile, setExcelFile] = useState(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
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

    const { data: topicsData } = useQuery({
        queryKey: ['topicsAddQuestionExam', { selectedSubject }],
        queryFn: () => examApi.getAllTopicBySubject(getSubjectNameById(selectedSubject), 0, 100)
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
    console.log(editQuestion);
    console.log(questions);

    const handleFile = (e: any) => {
        let fileType = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
        ];
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile && fileType.includes(selectedFile?.type)) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e: any) => {
                    setExcelFile(e.target.result);
                };
            } else {
                toast.error('Vui lòng chỉ chọn file excel');
                setExcelFile(null);
            }
            console.log(selectedFile?.type);
        } else {
            console.log('Please select your file');
        }
    };

    const handleFileSubmit = (e: any) => {
        if (excelFile !== null) {
            const workbook = XLSX.read(excelFile, { type: 'buffer' });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const headers: any = data[0];
            const requiredHeaders = ['statement', 'explanation', 'A', 'B', 'C', 'D', 'topic', 'correctAnswer', 'level'];
            const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
            if (missingHeaders.length > 0) {
                toast.error('Error file input');
            } else {
                const statementIndex = headers.indexOf('statement');
                const explanationIndex = headers.indexOf('explanation');
                const answerIndices = ['A', 'B', 'C', 'D'];
                const topicIndex = headers.indexOf('topic');
                const correctAnswerIndex = headers.indexOf('correctAnswer');
                const levelIndex = headers.indexOf('level');

                const questions = data.slice(1).map((row: any) => {
                    const statement = row[statementIndex];
                    const explanation = row[explanationIndex];
                    const answerList = answerIndices.map(answer => String(row[headers.indexOf(answer)]));
                    const topicName = row[topicIndex];
                    const correctAnswer = row[correctAnswerIndex];
                    const level = row[levelIndex];
                    const matchedTopic = topicsData?.data?.find((topic: any) => String(topic.name).includes(topicName));
                    if (matchedTopic) {
                        const topicId = matchedTopic.id;

                        return {
                            statement,
                            explanation,
                            answerList,
                            topicId,
                            correctAnswer,
                            level
                        };
                    } else {
                        return null;
                    }
                });
                const validQuestions = questions.filter((question: any) => question !== null);
                if (validQuestions?.length > 0) {
                    setQuestions(prevQuestions => [...prevQuestions, ...validQuestions]);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    setExcelFile(null);
                } else {
                    toast.error('File bài tập của bạn không phù hợp với môn hiện tại vui lòng chọn file khác');
                }
            }
        } else {
            toast.error('Vui lòng chọn file trước khi thêm câu hỏi');
        }
    };

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

            if (response) {
                router.push('/admin/exam');
                toast.success('Tạo bài thi thành công');
            }
            toast.dismiss(toastLoading);
        } catch (error) {
            setIsSubmitting(false);
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error creating exam:', error);
        }
    };

    if (!subjectsData) return <Loader />;

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <form onSubmit={handleSubmit(createExam)}>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Tạo bài thi</h3>
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
                                onChange={handleFile}
                            />
                        </div>
                        <Button onClick={handleFileSubmit} color="success" variant="flat" className="mt-8">
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
                {questions && questions.length > 2 && (
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
