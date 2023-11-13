'use client';

import { Accordion, AccordionItem, Button, Chip, Radio, RadioGroup } from '@nextui-org/react';

interface TestEditItemProps {}

const TestEditItem: React.FC<TestEditItemProps> = ({}) => {
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

    return (
        <li className="mt-4">
            <span className="font-semibold text-sm">
                <div className="flex items-center gap-4">
                    <Chip color="primary" variant="flat" size="md">
                        Câu 1
                    </Chip>
                    <Button color="warning" size="sm">
                        Chỉnh sửa
                    </Button>
                </div>
                <p className="mt-2">{defaultContent}</p>
            </span>
            <RadioGroup value="london" className="mt-2">
                <Radio size="sm" value="buenos-aires">
                    <div className="ml-2">
                        <span className="font-bold mr-3">A.</span>
                        <span>{defaultContent}</span>
                    </div>
                </Radio>
                <Radio size="sm" value="sydney">
                    <div className="ml-2 rounded-md">
                        <span className="font-bold mr-3">B.</span>
                        {defaultContent}
                    </div>
                </Radio>
                <Radio size="sm" value="san-francisco">
                    <div className="ml-2">
                        <span className="font-bold mr-3">C.</span>
                        {defaultContent}
                    </div>
                </Radio>
                <Radio size="sm" value="london">
                    <div className="ml-2 bg-green-100 rounded-md">
                        <span className="font-bold mr-3">D.</span>
                        {defaultContent}
                    </div>
                </Radio>
            </RadioGroup>
            <div className="mt-4 mb-8">
                <Accordion isCompact variant="bordered">
                    <AccordionItem key="1" aria-label="Accordion 1" title="Xem lời giải" className="text-sm">
                        {defaultContent}
                    </AccordionItem>
                </Accordion>
            </div>
        </li>
    );
};

export default TestEditItem;
