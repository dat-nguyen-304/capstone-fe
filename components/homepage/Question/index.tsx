'use client';

import { Accordion, AccordionItem } from '@nextui-org/react';

interface QuestionProps {}

const Question: React.FC<QuestionProps> = () => {
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

    return (
        <div className="w-[96%] sm:w-[90%] lg:w-[80%] mx-auto bg-blue-100 rounded-3xl">
            <div className="w-[90%] sm:w-[80%] lg:w-[70%] mx-auto py-16">
                <div className="text-center mb-8">
                    <div className="mb-2">
                        <span className="text-xl md:text-2xl font-semibold text-blue-600">Câu hỏi </span>
                        <span className="text-xl md:text-2xl font-semibold text-gray-600">thường gặp</span>
                    </div>
                    <div>
                        <span className="text-sm">Cùng CEPA giải đáp những thắc mắc của bạn nhé !</span>
                    </div>
                </div>
                <Accordion
                    variant="bordered"
                    itemClasses={{
                        indicator: 'text-large',
                        content: 'text-sm px-2',
                        title: 'font-semibold text-[#444] text-base'
                    }}
                >
                    <AccordionItem key="1" aria-label="Accordion 1" title="Thời gian sở hữu khóa học tại CEPA">
                        {defaultContent}
                    </AccordionItem>
                    <AccordionItem key="2" aria-label="Accordion 2" title="Học theo lộ trình như thế nào">
                        {defaultContent}
                    </AccordionItem>
                    <AccordionItem key="3" aria-label="Accordion 3" title="Các nguyên tác cộng đồng">
                        {defaultContent}
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

export default Question;
