'use client';

import { Pagination } from '@nextui-org/react';
import FeedbackItem from './FeedBackItem';

interface FeedbackProps {}

const Feedback: React.FC<FeedbackProps> = ({}) => {
    return (
        <>
            <h3 className="font-bold text-lg text-slate-800 mb-8 uppercase mt-16">Đánh giá</h3>
            <ul>
                <FeedbackItem />
                <FeedbackItem />
                <FeedbackItem />
                <FeedbackItem />
            </ul>
            <div className="flex justify-center my-8">
                <Pagination total={10} />
            </div>
        </>
    );
};

export default Feedback;
