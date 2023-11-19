'use client';

import TestReviewItem from '@/components/test/TestReviewItem';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

interface QuizDetailProps {}

const QuizDetail: React.FC<QuizDetailProps> = ({}) => {
    return (
        <>
            <div className="w-[90%] mx-auto">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Bài kiểm tra abxyz</h3>
                    <div>
                        <Button
                            as={Link}
                            size="sm"
                            href="/teacher/quiz/edit/1"
                            className="text-black hover:text-black mr-2"
                            color="warning"
                        >
                            Chỉnh sửa
                        </Button>
                        <Button
                            as={Link}
                            size="sm"
                            href="/teacher/quiz"
                            className="!text-red hover:!text-red"
                            color="danger"
                            variant="bordered"
                        >
                            Quay lại
                        </Button>
                    </div>
                </div>
                <ul className="mt-8">
                    {/* <TestReviewItem />
                    <TestReviewItem />
                    <TestReviewItem />
                    <TestReviewItem />
                    <TestReviewItem />
                    <TestReviewItem />
                    <TestReviewItem />
                    <TestReviewItem /> */}
                </ul>
            </div>
        </>
    );
};

export default QuizDetail;
