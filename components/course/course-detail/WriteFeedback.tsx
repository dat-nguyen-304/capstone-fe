'use client';

import { Button, Textarea } from '@nextui-org/react';
import { Rate } from 'antd';
import { useState } from 'react';

interface WriteFeedbackProps {
    onSubmit: (feedback: { rating: number; comment: string }) => void;
}

const WriteFeedback: React.FC<WriteFeedbackProps> = ({ onSubmit }) => {
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>('');
    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };
    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // Adjust the type to accept both input and textarea events
        setComment(e.target.value);
    };
    const handleSubmit = () => {
        // Validate the feedback before submitting
        if (comment.trim() === '') {
            // Display an error or prevent submission
            return;
        }

        // Call the onSubmit prop with the feedback data
        onSubmit({ rating, comment });

        // Optionally, you can reset the state after submission
        setRating(5);
        setComment('');
    };
    return (
        <>
            <h3 className="font-bold text-lg text-slate-800 mb-8 uppercase mt-16">Đánh giá của bạn</h3>
            <Rate defaultValue={rating} value={rating} onChange={handleRatingChange} />
            <Textarea
                variant="underlined"
                labelPlacement="outside"
                placeholder="Viết đánh giá của bạn"
                value={comment}
                onChange={handleCommentChange}
            />
            <div className="flex justify-end">
                <Button
                    className="mt-4"
                    disabled={!comment}
                    color={comment === '' ? 'default' : 'primary'}
                    onClick={handleSubmit}
                >
                    Bình luận
                </Button>
            </div>
        </>
    );
};

export default WriteFeedback;
