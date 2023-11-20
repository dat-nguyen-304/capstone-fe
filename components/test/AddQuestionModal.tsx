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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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
    const [selectTopic, setSelectTopic] = useState<number>();
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
        queryKey: ['topicsExam', subject],
        queryFn: () => examApi.examinationTopics(0, 100)
    });

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

        // Close the modal
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
                                            label="Mức độ"
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
                                        <Select
                                            label="Chủ đề"
                                            color="primary"
                                            isRequired
                                            variant="bordered"
                                            labelPlacement="outside"
                                            defaultSelectedKeys={
                                                editQuestion?.topicId ? [`${editQuestion?.topicId}`] : ['1']
                                            }
                                            onChange={event => setSelectTopic(Number(event.target.value))}
                                        >
                                            {topicsData?.data?.map((topic: Topic) => (
                                                <SelectItem key={topic?.id} value={topic?.id}>
                                                    {topic?.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div>
                                        <label>Nội dung câu hỏi</label>
                                        <InputFormula
                                            name="questionContent"
                                            control={control}
                                            placeholder="Nội dung câu hỏi..."
                                        />
                                    </div>
                                    <div className="mt-16">
                                        <label>Nội dung lời giải</label>
                                        <InputFormula
                                            name="resultContent"
                                            control={control}
                                            placeholder="Nội dung lời giải..."
                                        />
                                    </div>
                                </div>
                                <div className="w-full border-t-2 mt-20 border-blue-500 border-dashed">
                                    <div className=" mt-[-2rem]">
                                        {answerList.map((answer, id) => (
                                            <div key={answer.name} className="flex items-center gap-2">
                                                <div className="flex-[1] mt-16">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <label className="text-sm">Đáp án {answer.name}</label>
                                                        </div>
                                                        <div className="flex items-center">
                                                            {answer.isCorrect ? (
                                                                <Chip color="success">Đúng </Chip>
                                                            ) : (
                                                                <div>
                                                                    <button
                                                                        onClick={() => changeCorrectAnswer(id)}
                                                                        className="text-sm text-green-500 mr-2"
                                                                    >
                                                                        [Đúng]
                                                                    </button>
                                                                    <Chip color="danger">Sai</Chip>
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
