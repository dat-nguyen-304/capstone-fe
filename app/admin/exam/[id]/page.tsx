'use client';

import { examApi } from '@/api-client';
import TestReviewItem from '@/components/test/TestReviewItem';
import { QuestionType } from '@/types';
import { Button } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface ExamDetailProps {
    params: { id: number };
}

const ExamDetail: React.FC<ExamDetailProps> = ({ params }) => {
    const { data, isLoading } = useQuery<any>({
        queryKey: ['exam-detail'],
        queryFn: () => examApi.getExamById(params?.id)
    });
    console.log(data);

    return (
        <>
            <div className="w-[90%] mx-auto">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">{data?.name}</h3>
                    <div>
                        <Button
                            as={Link}
                            size="sm"
                            href={`/admin/exam/edit/${data?.id}`}
                            className="text-black hover:text-black mr-2"
                            color="warning"
                        >
                            Chỉnh sửa
                        </Button>
                        <Button
                            as={Link}
                            size="sm"
                            href="/admin/exam"
                            className="!text-red hover:!text-red"
                            color="danger"
                            variant="bordered"
                        >
                            Quay lại
                        </Button>
                    </div>
                </div>
                <ul className="mt-8">
                    {data?.questionList?.length ? (
                        data?.questionList?.map((questions: QuestionType, index: number) => (
                            <TestReviewItem key={index} questions={questions} index={index} />
                        ))
                    ) : (
                        <>Empty List Question</>
                    )}
                    {/* <TestReviewItem />
                    <TestReviewItem />
                    <TestReviewItem />
                    <TestReviewItem /> */}
                </ul>
            </div>
        </>
    );
};

export default ExamDetail;
