'use client';
import { InputFormula } from '@/components/form-input/InputFormula';
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface AddQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ isOpen, onClose }) => {
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
    const { control, handleSubmit, setError, reset } = useForm({
        defaultValues: {
            name: '',
            course: '',
            questionContent: '',
            resultContent: ''
        }
    });

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
        console.log(values);
    };

    return (
        <Modal size="5xl" className="!z-[10000]" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-blue-500">Thêm câu hỏi 1</ModalHeader>
                        <ModalBody className="max-h-[60vh] overflow-auto">
                            <div className="mt-2 ">
                                <div>
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
                                                        value="123"
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
                            <Button color="primary" onClick={handleSubmit(onSubmit)}>
                                Thêm câu hỏi
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default AddQuestionModal;
