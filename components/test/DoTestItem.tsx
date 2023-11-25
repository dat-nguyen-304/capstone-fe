'use client';

import { QuestionType } from '@/types';
import { Chip, Radio, RadioGroup } from '@nextui-org/react';
import HTMLReactParser from 'html-react-parser';

interface DoTestItemProps {
    index: number;
    questions: QuestionType | any;
    onAnswer: (index: number, selection: string) => void;
    ref: any;
}

const DoTestItem: React.FC<DoTestItemProps> = ({ questions, index, onAnswer, ref }) => {
    const handleAnswer = (selection: string) => {
        onAnswer(index, selection);
    };

    return (
        <li className="mt-4" ref={ref}>
            <span className="font-semibold text-sm flex items-center">
                <span>
                    <Chip color="primary" variant="flat">
                        Câu {index + 1}
                    </Chip>{' '}
                    <span className="inline-block">{HTMLReactParser(questions?.question?.statement)}</span>
                </span>
            </span>
            <RadioGroup className="mt-2">
                {questions?.question?.answerList?.map((answerList: any, index: number) => (
                    <Radio
                        key={index}
                        size="sm"
                        value={String.fromCharCode(65 + index)}
                        onChange={() => handleAnswer(String.fromCharCode(65 + index))}
                        className="font-bold mr-3"
                    >
                        <div className="ml-2">
                            <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                            <span className="inline-block">{HTMLReactParser(answerList)}</span>
                        </div>
                    </Radio>
                ))}
            </RadioGroup>
        </li>
    );
};

export default DoTestItem;
