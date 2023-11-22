'use client';

import { Pagination } from '@nextui-org/react';
import FeedbackItem from './FeedBackItem';

interface FeedbackProps {
    feedbacksData: any;
}
const feedbackInfo = {
    fullname: 'Nguyễn Văn A',
    rating: 5,
    content: 'Nội dung khóa học rất hay'
};
const Feedback: React.FC<FeedbackProps> = ({ feedbacksData }) => {
    return (
        <>
            <h3 className="font-bold text-lg text-slate-800 mb-8 uppercase mt-16">Đánh giá</h3>
            <ul>
                {feedbacksData?.data?.length ? (
                    feedbacksData?.data?.map((feedbackInfo: any, index: any) => (
                        <FeedbackItem key={index} feedbackInfo={feedbackInfo} />
                    ))
                ) : (
                    <>
                        <FeedbackItem feedbackInfo={feedbackInfo} />
                    </>
                )}
                {/* <FeedbackItem />
                <FeedbackItem />
                <FeedbackItem />
                <FeedbackItem /> */}
            </ul>
            {feedbacksData?.totalPage && feedbacksData?.totalPage > 1 ? (
                <div className="flex justify-center my-8">
                    <Pagination total={feedbacksData?.totalPage || 1} />
                </div>
            ) : null}
        </>
    );
};

export default Feedback;
