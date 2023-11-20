'use client';

import { QuestionType } from '@/types';
import { Chip, Radio, RadioGroup } from '@nextui-org/react';
import HTMLReactParser from 'html-react-parser';
import { BsFlag } from 'react-icons/bs';

interface DoTestItemProps {
    index: number;
    questions: QuestionType | any;
    onAnswer: (index: number, selection: string) => void;
}

const DoTestItem: React.FC<DoTestItemProps> = ({ questions, index, onAnswer }) => {
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    const handleAnswer = (selection: string) => {
        onAnswer(index, selection);
    };
    return (
        <li className="mt-4">
            <span className="font-semibold text-sm flex items-center">
                <BsFlag className="w-[30px] mr-2 cursor-pointer" />
                <span>
                    <Chip color="primary" variant="flat" size="sm">
                        Câu {index + 1}
                    </Chip>{' '}
                    <span className="inline-block">{HTMLReactParser(questions?.statement)}</span>
                </span>
            </span>
            <RadioGroup className="mt-2">
                {questions?.answerList?.map((answerList: any, index: number) => (
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
            {/* <RadioGroup className="mt-2">
                <Radio size="sm" value="buenos-aires">
                    <div className="ml-2">
                        <span className="font-bold mr-3">A.</span>
                        <span>{defaultContent}</span>
                    </div>
                </Radio>
                <Radio size="sm" value="sydney">
                    <div className="ml-2">
                        <span className="font-bold mr-3">B.</span>
                        <span>{defaultContent}</span>
                    </div>
                </Radio>
                <Radio size="sm" value="san-francisco">
                    <div className="ml-2">
                        <span className="font-bold mr-3">C.</span>
                        <span>{defaultContent}</span>
                    </div>
                </Radio>
                <Radio size="sm" value="london">
                    <div className="ml-2">
                        <span className="font-bold mr-3">D.</span>
                        <span>{defaultContent}</span>
                    </div>
                </Radio>
            </RadioGroup> */}
        </li>
    );
};

export default DoTestItem;
