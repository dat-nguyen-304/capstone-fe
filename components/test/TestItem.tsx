'use client';

import { Radio, RadioGroup } from '@nextui-org/react';
import { BsFillFlagFill, BsFlag } from 'react-icons/bs';

interface TestItemProps {}

const TestItem: React.FC<TestItemProps> = ({}) => {
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

    return (
        <li className="mt-4">
            <span className="font-semibold text-sm flex items-center">
                <BsFlag className="w-[30px] mr-2 cursor-pointer" />
                <span>Câu 1: {defaultContent}</span>
            </span>
            <RadioGroup className="mt-2">
                <Radio size="sm" value="buenos-aires">
                    {defaultContent}
                </Radio>
                <Radio size="sm" value="sydney">
                    {defaultContent}
                </Radio>
                <Radio size="sm" value="san-francisco">
                    {defaultContent}
                </Radio>
                <Radio size="sm" value="london">
                    {defaultContent}
                </Radio>
            </RadioGroup>
        </li>
    );
};

export default TestItem;
