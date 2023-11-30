'use client';
import { examApi } from '@/api-client';
import { InputFormula } from '@/components/form-input/InputFormula';
import { Topic } from '@/types';
import {
    Button,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import HTMLReactParser from 'html-react-parser';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone, FileWithPath, DropzoneRootProps } from 'react-dropzone';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { FaCheck } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';

interface AddQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddQuestion: (question: any) => void | null;
    onEditQuestion: (question: any, index: number) => void | null;
    editIndex?: number | undefined;
    editQuestion?: any | null;
    subject: string;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
    isOpen,
    onClose,
    onAddQuestion,
    onEditQuestion,
    editIndex,
    editQuestion,
    subject
}) => {
    const [answerList, setAnswerList] = useState<{ name: string; content: string; isCorrect: boolean }[]>([
        {
            name: 'A',
            content: '',
            isCorrect: true
        },
        {
            name: 'B',
            content: '',
            isCorrect: false
        },
        {
            name: 'C',
            content: '',
            isCorrect: false
        },
        {
            name: 'D',
            content: '',
            isCorrect: false
        }
    ]);
    const [level, setLevel] = useState<string>('EASY');
    const { control, handleSubmit, setError, reset, setValue, getValues } = useForm({
        defaultValues: {
            name: '',
            course: '',
            questionContent: '',
            resultContent: '',
            A: '',
            B: '',
            C: '',
            D: ''
        }
    });
    const { data: topicsData } = useQuery({
        queryKey: ['topicsExam', { subject }],
        queryFn: () => examApi.getAllTopicBySubject(subject, 0, 100)
    });

    const [selectTopic, setSelectTopic] = useState<number>();

    useEffect(() => {
        if (topicsData) {
            setSelectTopic(topicsData?.data[0]?.id);
        }
    }, [topicsData]);

    useEffect(() => {
        if (editQuestion) {
            setValue('questionContent', editQuestion?.statement);
            setValue('resultContent', editQuestion?.explanation);
            setLevel(editQuestion?.level);
            setSelectTopic(editQuestion?.topicId);
            const correctAnswer = editQuestion?.correctAnswer;
            editQuestion.answerList.forEach((answerHtml: any, index: any) => {
                const fieldName = String.fromCharCode(65 + index) as 'A' | 'B' | 'C' | 'D';
                setValue(fieldName, answerHtml);
            });
            setAnswerList(prevList => {
                return prevList.map((answer, index) => ({
                    ...answer,
                    isCorrect: correctAnswer === String.fromCharCode(65 + index)
                }));
            });
        }
    }, [editQuestion]);

    const changeCorrectAnswer = (id: number) => {
        const newAnswerList = answerList.map(answer => {
            return {
                ...answer,
                isCorrect: false
            };
        });
        newAnswerList[id].isCorrect = true;

        setAnswerList(newAnswerList);
    };

    const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[]>([]);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setUploadedFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, fileRejections }: DropzoneRootProps = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1,
        multiple: false
    });

    const onSubmit = (values: any) => {
        const correctAnswerIndex = answerList.findIndex(answer => answer.isCorrect);
        const correctAnswerLetter = ['A', 'B', 'C', 'D'][correctAnswerIndex];
        const question = {
            statement: values.questionContent,
            explanation: values.resultContent,
            answerList: answerList.map((answer, index) => values[answer.name]),
            topicId: selectTopic || 1,
            correctAnswer: correctAnswerLetter,
            level: level
        };

        if (editIndex !== undefined) {
            onEditQuestion(question, editIndex);
        } else {
            onAddQuestion(question);
        }
        reset();
        onClose();
    };

    return (
        <Modal size="5xl" className="!z-[10000]" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-blue-500">Thêm câu hỏi</ModalHeader>
                        <ModalBody className="max-h-[60vh] overflow-auto">
                            <div className="mt-2 ">
                                <div>
                                    <div className="col-span-10 sm:grid grid-cols-2 gap-4 my-5">
                                        <Select
                                            label="Chủ đề"
                                            color="primary"
                                            isRequired
                                            variant="bordered"
                                            labelPlacement="outside"
                                            defaultSelectedKeys={editQuestion ? [`${editQuestion?.topicId}`] : ['1']}
                                            onChange={event => setSelectTopic(Number(event.target.value))}
                                        >
                                            {topicsData?.data?.map((topic: Topic) => (
                                                <SelectItem key={topic?.id} value={topic?.id}>
                                                    {topic?.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <Select
                                            label="Mức độ"
                                            isRequired
                                            color="primary"
                                            variant="bordered"
                                            labelPlacement="outside"
                                            defaultSelectedKeys={editQuestion ? [`${editQuestion?.level}`] : ['EASY']}
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
                                    </div>
                                    <div>
                                        <label>Nội dung câu hỏi</label>
                                        <div>
                                            {/* <div className="mt-4 mb-2 h-[120px] w-[200px] border-2 border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer">
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} name="avatar" />
                                                    {uploadedFiles.length > 0 ? (
                                                        <div className="group relative">
                                                            <Image
                                                                className="object-cover w-full h-[120px]"
                                                                key={uploadedFiles[0].path}
                                                                src={URL.createObjectURL(uploadedFiles[0])}
                                                                alt={uploadedFiles[0].path as string}
                                                                width={240}
                                                                height={240}
                                                            />
                                                            <div className="absolute top-0 right-0 bottom-0 left-0 hidden text-white group-hover:flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)]">
                                                                <RiImageEditLine size={40} />
                                                                <span className="text-sm">Cập nhật ảnh minh họa</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col justify-center items-center">
                                                            <RiImageAddLine size={40} />
                                                            <span className="text-sm">Tải lên ảnh minh họa</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div> */}
                                            <div className="flex-[1]" suppressContentEditableWarning={true}>
                                                <InputFormula
                                                    name="questionContent"
                                                    control={control}
                                                    placeholder="Nội dung câu hỏi..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-16" suppressContentEditableWarning={true}>
                                        <label>Nội dung lời giải</label>
                                        <InputFormula
                                            name="resultContent"
                                            control={control}
                                            placeholder="Nội dung lời giải..."
                                        />
                                    </div>
                                </div>
                                <div className="w-full border-t-2 mt-20 border-blue-500 border-dashed">
                                    <div className=" mt-[-2rem]" suppressContentEditableWarning={true}>
                                        {answerList.map((answer, id) => (
                                            <div key={answer.name} className="flex items-center gap-2">
                                                <div className="flex-[1] mt-16">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <label className="text-sm">Đáp án {answer.name}</label>
                                                        </div>
                                                        <div className="flex items-center">
                                                            {answer.isCorrect ? (
                                                                <Chip color="success">
                                                                    <FaCheck className="text-white" />
                                                                </Chip>
                                                            ) : (
                                                                <div className="flex items-center">
                                                                    <button
                                                                        onClick={() => changeCorrectAnswer(id)}
                                                                        className=" text-sm text-green-500 mr-2"
                                                                    >
                                                                        <FaCheck />
                                                                    </button>
                                                                    <Chip color="danger">
                                                                        <RxCross2 />
                                                                    </Chip>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <InputFormula
                                                        name={answer.name}
                                                        control={control}
                                                        value={editQuestion ? editQuestion.answerList[id] : ''}
                                                        placeholder={`Đáp án ${answer.name}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onClick={onClose}>
                                Đóng
                            </Button>
                            <Button color="danger" variant="light" onClick={() => reset()}>
                                Đặt lại
                            </Button>
                            <Button color={editQuestion ? 'warning' : 'primary'} onClick={handleSubmit(onSubmit)}>
                                {editQuestion ? 'Lưu câu hỏi' : '  Thêm câu hỏi'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default AddQuestionModal;
