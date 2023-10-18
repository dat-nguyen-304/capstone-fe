'use client';

import { Button, Textarea } from '@nextui-org/react';
import { Rate } from 'antd';

interface WriteFeedbackProps {}

const WriteFeedback: React.FC<WriteFeedbackProps> = ({}) => {
    return (
        <>
            <h3 className="font-bold text-lg text-slate-800 mb-8 uppercase mt-16">Đánh giá của bạn</h3>
            <Rate defaultValue={5} />
            <Textarea variant="underlined" labelPlacement="outside" placeholder="Viết đánh giá của bạn" />
            <div className="flex justify-end">
                <Button className="mt-4">Bình luận</Button>
            </div>
        </>
    );
};

export default WriteFeedback;
