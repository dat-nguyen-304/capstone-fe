'use client';

import { Chip, Radio, RadioGroup } from '@nextui-org/react';
import { BsFlag } from 'react-icons/bs';

interface DoTestItemProps {}

const DoTestItem: React.FC<DoTestItemProps> = ({}) => {
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

    return (
        <li className="mt-4">
            <span className="font-semibold text-sm flex items-center">
                <BsFlag className="w-[30px] mr-2 cursor-pointer" />
                <span>
                    <Chip color="primary" variant="flat" size="sm">
                        Câu 1
                    </Chip>{' '}
                    {defaultContent}
                </span>
            </span>
            <RadioGroup className="mt-2">
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
            </RadioGroup>
        </li>
    );
};

export default DoTestItem;
