'use client';

import { examApi } from '@/api-client';
import TestReviewItem from '@/components/test/TestReviewItem';
import { QuestionType } from '@/types';
import { Button } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ExamDetailProps {
    params: { id: number };
}

const QuizDetail: React.FC<ExamDetailProps> = ({ params }) => {
    const router = useRouter();
    const { data, isLoading, status } = useQuery<any>({
        queryKey: ['exam-detail', { params: params?.id }],
        queryFn: () => examApi.getExamById(params?.id)
    });
    console.log(data);

    return (
        <>
            <div className="w-[90%] mx-auto" suppressContentEditableWarning={true}>
                <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">{data?.name}</h3>
                        <div>
                            <Button
                                as={Link}
                                size="sm"
                                href={`/teacher/quiz/edit/${data?.id}`}
                                className="text-black hover:text-black mr-2"
                                color="warning"
                            >
                                Chỉnh sửa
                            </Button>
                            <Button
                                size="sm"
                                className="!text-red hover:!text-red"
                                color="danger"
                                variant="bordered"
                                onClick={() => router.back()}
                            >
                                Quay lại
                            </Button>
                        </div>
                    </div>
                    <ul className="mt-8" suppressContentEditableWarning>
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
                </Spin>
            </div>
        </>
    );
};

export default QuizDetail;
