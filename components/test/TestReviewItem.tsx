'use client';

import { QuestionType } from '@/types';
import { Accordion, AccordionItem, Chip, Radio, RadioGroup } from '@nextui-org/react';
import HTMLReactParser from 'html-react-parser';

interface TestReviewItemProps {
    index: number;
    questions: QuestionType | any;
}

const TestReviewItem: React.FC<TestReviewItemProps> = ({ questions, index }) => {
    return (
        <li className="mt-4">
            <div suppressContentEditableWarning={true}>
                <span className="font-semibold text-sm flex items-center">
                    <span>
                        <Chip color="primary" variant="flat" size="sm">
                            Câu {index + 1}
                        </Chip>{' '}
                        <span className="inline-block" suppressContentEditableWarning={true}>
                            {HTMLReactParser(questions?.statement)}
                        </span>
                    </span>
                </span>
            </div>
            {questions?.answerList?.map((answerList: any, index: number) => (
                <div key={index} suppressContentEditableWarning={true}>
                    <RadioGroup key={index} value={questions?.correctAnswer} className="mt-2">
                        <Radio
                            size="sm"
                            value={String.fromCharCode(65 + index)}
                            className={`ml-2 ${
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
