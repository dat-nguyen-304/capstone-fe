'use client';

import { examApi } from '@/api-client';
import TestReviewItem from '@/components/test/TestReviewItem';
import { useCustomModal } from '@/hooks';
import { QuestionType } from '@/types';
import { Button } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ExamDetailProps {
    params: { id: number };
}

const ExamDetail: React.FC<ExamDetailProps> = ({ params }) => {
    const router = useRouter();
    const { data, isLoading, status } = useQuery<any>({
        queryKey: ['exam-detail', { params: params?.id }],
        queryFn: () => examApi.getExamById(params?.id)
    });
    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    const handleStatusChange = async (id: number, status: string) => {
        try {
            onLoading();
            const res = await examApi.updateStatusExam(id, status);
            if (!res.data.code) {
                onSuccess({
                    title: `${
                        status === 'BANNED' ? 'Đã cấm bài tập thành công' : 'Đã vô hiệu hóa bài thi thành công'
                    } `,
                    content: `${
                        status === 'BANNED' ? 'Bài tập đã bị cấm thành công' : 'Bài thi đã bị vô hiệu hóa thành công'
                    } `
                });
                router.back();
            }
        } catch (error) {
            // Handle error
            onDanger({
                title: 'Có lỗi xảy ra',
                content: 'Hệ thống gặp trục trặc, thử lại sau ít phút'
            });
            console.error('Error changing user status', error);
        }
    };
    const onDeactivateOpen = (id: number, status: string) => {
        onDanger({
            title: `Xác nhận ${status === 'BANNED' ? 'cấm' : 'vô hiệu hóa'}`,
            content: `Bài thi này sẽ không được hiện thị sau khi  ${
                status === 'BANNED' ? 'cấm' : 'vô hiệu hóa'
            }. Bạn chắc chứ?`,
            activeFn: () => handleStatusChange(id, status)
        });
        onOpen();
    };
    return (
        <>
            <div className="w-[90%] mx-auto" suppressContentEditableWarning={true}>
                <Spin spinning={status === 'loading' ? true : false} size="large" tip="Đang tải">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">{data?.name}</h3>
                        <div>
                            {data?.examType !== 'QUIZ' && data?.examType !== 'QUIZ_DRAFT' ? (
                                <Button
                                    as={Link}
                                    size="sm"
                                    href={`/admin/exam/edit/${data?.id}`}
                                    className="text-black hover:text-black mr-2"
                                    color="warning"
                                >
                                    Chỉnh sửa
                                </Button>
                            ) : null}
                            <Button
                                size="sm"
                                className="!text-red hover:!text-red mr-2"
                                color="danger"
                                variant="bordered"
                                onClick={() =>
                                    onDeactivateOpen(
                                        data?.id,
                                        data?.examType === 'QUIZ' || data?.examType === 'QUIZ_DRAFT'
                                            ? 'BANNED'
                                            : 'DELETED'
                                    )
                                }
                            >
                                {data?.examType === 'QUIZ' || data?.examType === 'QUIZ_DRAFT' ? 'Cấm' : 'Vô hiệu'}
                            </Button>
                            <Button
                                size="sm"
                                className="!text-red hover:!text-red"
                                color="default"
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

export default ExamDetail;
