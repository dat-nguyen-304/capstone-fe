'use client';

import { courseApi, examApi } from '@/api-client';
import { InputText } from '@/components/form-input';
import AddQuestionModal from '@/components/test/AddQuestionModal';
import { Course } from '@/types';
import { Button, Checkbox, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { handleFileSelection, handleFileSubmitSelection } from '@/utils';
import TestReviewItem from '@/components/test/TestReviewItem';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa6';
import { BiUpArrowAlt } from 'react-icons/bi';
import { FiDelete } from 'react-icons/fi';
import { useCustomModal, useSelectedSidebar } from '@/hooks';
import QuizRuleModal from '@/components/rule/QuizRuleModal';
interface CreateQuizProps {}

function getSubjectName(subjectCode: string) {
    const subjectNames: { [key: string]: string | null } = {
        'Toán học': 'MATHEMATICS',
        'Tiếng anh': 'ENGLISH',
        'Vật lí': 'PHYSICS',
        'Hóa học': 'CHEMISTRY',
        'Sinh học': 'BIOLOGY',
        'Lịch sử': 'HISTORY',
        'Địa lý': 'GEOGRAPHY'
    };

    return subjectNames[subjectCode] || null;
}

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
    const [selectedCourse, setSelectedCourse] = useState<number>(0);
    const [editIndex, setEditIndex] = useState<number | undefined>();
    const [editQuestion, setEditQuestion] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedOptionCourse, setSelectedOptionCourse] = useState<string>();
    const [optionCourse, setOptionCourse] = useState<string[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [courseDetail, setCourseDetail] = useState<any>();
    const [excelFile, setExcelFile] = useState(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [openQuizRule, setOpenQuizRule] = useState(false);
    const [isCheckedPolicy, setIsCheckPolicy] = useState(false);
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: '',
            duration: ''
        }
    });

    const { data: topicsData } = useQuery({
        queryKey: ['topicsAddQuestionQuiz', { courseDetail }],
        queryFn: () => examApi.getAllTopicBySubject(getSubjectName(courseDetail?.subject) || 'MATHEMATICS', 0, 100)
    });

    const { data: updatingCoursesData, isLoading: isUpdatingCourseLoading } = useQuery({
        queryKey: ['draftCoursesList'],
        queryFn: () => courseApi.getAllOfTeacherDraft('', 'ALL', 0, 100, 'createdDate', 'DESC')
    });

    const { data: activatedCoursesData, isLoading: isActivatedCourseLoading } = useQuery({
        queryKey: ['coursesList'],
        queryFn: () => courseApi.getAllOfTeacher('', 'AVAILABLE', 0, 100, 'createdDate', 'DESC')
    });

    const getCourseById = (courseId: number, selectedOptionCourse: string) => {
        let getCourseDetail: any;
        if (selectedOptionCourse == 'OLD') {
            getCourseDetail = activatedCoursesData?.data?.find((course: any) => course.id === courseId);
        }
        if (selectedOptionCourse == 'NEW') {
            getCourseDetail = updatingCoursesData?.data?.find((course: any) => course.id === courseId);
        }

        // Search for the course by ID in both activated and updating courses

        // Return the found course or null if not found
        return getCourseDetail || null;
    };
    const { onTeacherKeys } = useSelectedSidebar();

    useEffect(() => {
        onTeacherKeys(['9']);
    }, []);

    useEffect(() => {
        // Example: Fetch details of the selected course when selectedCourse changes
        if (selectedOptionCourse == 'OLD') {
            if (selectedCourse) {
                const courseDetails = getCourseById(selectedCourse, 'OLD');

                setCourseDetail(courseDetails);
            }
        }
        if (selectedOptionCourse == 'NEW') {
            if (selectedCourse) {
                const courseDetails = getCourseById(selectedCourse, 'NEW');

                setCourseDetail(courseDetails);
            }
        }
    }, [selectedOptionCourse, selectedCourse, activatedCoursesData, updatingCoursesData]);

    useEffect(() => {
        let arr: string[] = [];
        if (activatedCoursesData?.data?.length) {
            arr.push('OLD');
            setSelectedOptionCourse('OLD');
        }
        if (updatingCoursesData?.data?.length) {
            arr.push('NEW');
            setSelectedOptionCourse('NEW');
        }
        setOptionCourse(arr);
    }, [activatedCoursesData, updatingCoursesData]);

    useEffect(() => {
        if (selectedOptionCourse) {
            if (selectedOptionCourse === 'NEW') setCourses(updatingCoursesData?.data);
            else setCourses(activatedCoursesData?.data);
        }
    }, [selectedOptionCourse]);

    const { onOpen: onConfirmOpen, onDanger, onWarning, onClose: onConfirmClose } = useCustomModal();
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
    const createQuiz = async (formData: any) => {
        if (!isCheckedPolicy) toast.error('Bạn cần đồng ý với điều khoản và chính sách của CEPA');
        else {
            setIsSubmitting(true);
            const toastLoading = toast.loading('Đang xử lí yêu cầu');
            try {
                const payload = {
                    name: formData?.name,
                    description: formData?.description || 'Miêu Tả',
                    duration: Number(formData?.duration || 60),
                    courseId: selectedCourse,
                    courseOrder: 100,
                    subject: getSubjectName(courseDetail?.subject),
                    // examType: 'QUIZ_DRAFT',
                    examType: selectedOptionCourse == 'NEW' ? 'QUIZ_DRAFT' : 'QUIZ',
                    questionList: questions
                };

                // Call the API to create the exam
                const response = await examApi.createExam(payload);

                if (response) {
                    setIsSubmitting(false);
                    toast.dismiss(toastLoading);
                    toast.success('Tạo bài tập thành công');
                    router.push('/teacher/quiz');
                }
            } catch (error) {
                // Handle any errors that occur during the API call
                console.error('Error creating exam:', error);
                toast.dismiss(toastLoading);
                toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
                // You can also show a user-friendly error message
            }
        }
    };

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <form onSubmit={handleSubmit(createQuiz)}>
                <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Tạo bài tập mới</h3>
                <div className="sm:grid grid-cols-6 my-4 gap-3">
                    <div className="my-4 col-span-3 lg:col-span-3">
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
                        <InputText
                            isRequired
                            variant="bordered"
                            name="duration"
                            size="sm"
                            color="primary"
                            label="Thời gian (phút)"
                            control={control}
                        />
                    </div>
                </div>
                <div className="sm:grid grid-cols-6 my-4 gap-3">
                    <div className="my-4 col-span-3 lg:col-span-3">
                        {optionCourse.length === 2 && selectedOptionCourse ? (
                            <div className="col-span-2">
                                <Select
                                    isDisabled={questions?.length > 0 ? true : false}
                                    isRequired
                                    size="sm"
                                    label="Bài tập này thuộc"
                                    color="primary"
                                    variant="bordered"
                                    defaultSelectedKeys={[selectedOptionCourse]}
                                    onChange={event => setSelectedOptionCourse(event?.target?.value)}
                                    description="Khóa học đang cập nhật là những khóa học đang cập nhật thông tin và chưa được phê duyệt từ hệ thống. Khóa học đang hoạt động là những khóa học hiện đang được đăng bán"
                                >
                                    <SelectItem key={'NEW'} value={'NEW'}>
                                        Khóa học đang cập nhật
                                    </SelectItem>
                                    <SelectItem key={'OLD'} value={'OLD'}>
                                        Khóa học đang hoạt động
                                    </SelectItem>
                                </Select>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="my-4 col-span-3 lg:col-span-3">
                        <Select
                            // disabled={questions?.length > 0 ? true : false}
                            isDisabled={questions?.length > 0 ? true : false}
                            isRequired
                            size="sm"
                            label="Khóa học"
                            color="primary"
                            description="Bài tập của bạn sẽ được đưa vào cuối danh sách của khóa học này. Bạn có thể thay đổi trình tự của bài tập trong khóa học tại phần 'Chỉnh sửa khóa học'."
                            variant="bordered"
                            onChange={event => setSelectedCourse(Number(event.target.value))}
                        >
                            {courses?.map((course: Course) => (
                                <SelectItem key={course?.id} value={course?.id}>
                                    {course?.courseName}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className="lg:flex justify-between items-center">
                    <div className="">
                        <Button
                            onClick={handlePopUpAddQuestion}
                            color="success"
                            variant="flat"
                            className="mt-8"
                            isDisabled={selectedCourse != 0 ? false : true}
                        >
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

                    <div className="md:flex justify-center items-center mt-8 md:mt-0">
                        <a
                            href={'/file/sample.xlsx'}
                            download={'sample.xlsx'}
                            className="mt-8 bg-green-100 hover:bg-green-300 py-3 px-4 rounded-md decoration-black text-green-500"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            Tải xuống file mẫu
                        </a>
                        <div className="mt-8 mx-2">
                            <label htmlFor="file-input" className="sr-only">
                                Chọn file
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                disabled={selectedCourse !== 0 ? false : true}
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
                            color="success"
                            variant="flat"
                            className="mt-8"
                            isDisabled={selectedCourse != 0 && excelFile !== null ? false : true}
                        >
                            Tải câu hỏi <BiUpArrowAlt />
                        </Button>
                    </div>
                </div>
                <AddQuestionModal
                    isOpen={isOpen}
                    onClose={onClose}
                    onAddQuestion={handleAddQuestion}
                    subject={String(getSubjectName(courseDetail?.subject || 'Toán học'))}
                    editIndex={editIndex}
                    editQuestion={editQuestion}
                    onEditQuestion={handleEditQuestion}
                />
                <div>
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
                </div>
                <div className="flex items-start mb-4 mt-8 sm:mt-12">
                    <div className="flex items-center h-5">
                        <Checkbox isSelected={isCheckedPolicy} onValueChange={setIsCheckPolicy} />
                    </div>
                    <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Tôi đồng ý với{' '}
                        <a
                            className="text-blue-600 hover:underline dark:text-blue-500"
                            onClick={() => setOpenQuizRule(true)}
                        >
                            chính sách và điều khoản của CEPA.
                        </a>
                    </label>
                </div>
                <Button
                    className="mt-4"
                    type="submit"
                    color="primary"
                    isDisabled={questions?.length > 0 ? false : true}
                    isLoading={isSubmitting}
                >
                    Tạo bài tập mới
                </Button>
            </form>
            <QuizRuleModal
                isOpen={openQuizRule}
                onOpen={() => setOpenQuizRule(true)}
                onClose={() => setOpenQuizRule(false)}
            />
        </div>
    );
};

export default CreateQuiz;
