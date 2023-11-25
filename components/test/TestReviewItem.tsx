'use client';

import { QuestionType } from '@/types';
import { Accordion, AccordionItem, Button, Chip, Radio, RadioGroup } from '@nextui-org/react';
import HTMLReactParser from 'html-react-parser';

interface TestReviewItemProps {
    index: number;
    questions: QuestionType | any;
    handleEditOpen?: (index: number) => void;
    handleDeleteQuestion?: (index: number) => void;
}

const TestReviewItem: React.FC<TestReviewItemProps> = ({ questions, index, handleEditOpen, handleDeleteQuestion }) => {
    return (
        <li className="mt-4">
            <div suppressContentEditableWarning={true}>
                <div className="text-sm flex items-center">
                    <div>
                        <Chip color="primary" variant="flat">
                            Câu {index + 1}
                        </Chip>{' '}
                        {handleDeleteQuestion && handleEditOpen && (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
                <p className="ml-1 mt-1" suppressContentEditableWarning={true}>
                    {HTMLReactParser(questions?.statement)}
                </p>
            </div>
            {questions?.answerList?.map((answerList: any, index: number) => (
                <div key={index} suppressContentEditableWarning={true}>
                    <RadioGroup key={index} value={questions?.correctAnswer} className="mt-2">
                        <Radio
                            size="sm"
                            value={String.fromCharCode(65 + index)}
                            className={`ml-2 my-0 ${
                                String.fromCharCode(65 + index) === questions?.correctAnswer
                                    ? 'bg-green-100 rounded-md'
                                    : ''
                            }`}
                        >
                            <div className="ml-2" suppressContentEditableWarning={true}>
                                <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                                <span className="inline-block">{HTMLReactParser(answerList)}</span>
                            </div>
                        </Radio>
                    </RadioGroup>
                </div>
            ))}
            <div className="mt-4 mb-8">
                <Accordion isCompact variant="bordered">
                    <AccordionItem
                        key="1"
                        aria-label="Accordion 1"
                        title="Xem lời giải"
                        className="text-sm"
                        suppressContentEditableWarning={true}
                    >
                        {HTMLReactParser(questions?.explanation)}
                    </AccordionItem>
                </Accordion>
            </div>
        </li>
    );
};

export default TestReviewItem;
