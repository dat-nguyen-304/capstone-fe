'use client';

import { Accordion, AccordionItem, Chip, Radio, RadioGroup } from '@nextui-org/react';
import HTMLReactParser from 'html-react-parser';
import { BsFlag } from 'react-icons/bs';

interface TestResultItemProps {
    index: number;
    questions: any;
}

const TestResultItem: React.FC<TestResultItemProps> = ({ questions, index }) => {
    console.log(questions);
    console.log(questions?.statement);
    const isCorrectAnswer = questions?.selectedAnswer === questions?.question?.correctAnswer;
    return (
        <li className="mt-4">
            <span className="font-semibold text-sm flex items-center">
                <span>
                    <Chip color="primary" variant="flat">
                        Câu {index + 1}
                    </Chip>{' '}
                    <span className="inline-block">{HTMLReactParser(questions?.question?.statement)}</span>
                </span>
            </span>
            {questions?.question?.answerList?.map((answerList: any, index: number) => (
                <div key={index} suppressContentEditableWarning={true}>
                    <RadioGroup key={index} value={questions?.question?.correctAnswer} className="mt-2">
                        <Radio
                            size="sm"
                            value={String.fromCharCode(65 + index)}
                            className={`ml-2 my-0 ${
                                isCorrectAnswer
                                    ? String.fromCharCode(65 + index) === questions?.selectedAnswer
                                        ? 'bg-green-100 rounded-md'
                                        : ''
                                    : String.fromCharCode(65 + index) === questions?.selectedAnswer
                                    ? 'bg-red-100 rounded-md'
                                    : String.fromCharCode(65 + index) === questions?.question?.correctAnswer
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
                    <AccordionItem key="1" aria-label="Accordion 1" title="Xem lời giải" className="text-sm">
                        {HTMLReactParser(questions?.question?.explanation)}
                    </AccordionItem>
                </Accordion>
            </div>
        </li>
    );
};

export default TestResultItem;
