'use client';

import { discussionApi } from '@/api-client';
import Loader from '@/components/Loader';
import PostTitle from '@/components/discussion/PostTitle';
import { InputFormula } from '@/components/form-input/InputFormula';
import { ReportModal } from '@/components/modal';
import CommentItem from '@/components/video/CommentItem';
import { useReportModal, useUser } from '@/hooks';
import { Button, Card, Pagination, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { BsArrowLeft } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { PuffLoader } from 'react-spinners';
import { toast } from 'react-toastify';

interface PostDetailProps {
    params: { id: number };
}

const PostDetail: React.FC<PostDetailProps> = ({ params }) => {
    const router = useRouter();
    const currentUser = useUser();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [filter, setFilter] = useState<number>(0);
    const [reportCommentId, setReportCommentId] = useState<number | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { data: discussionData, refetch: refetchDiscussion } = useQuery({
        queryKey: ['discussionDetail', { params: params?.id }],
        queryFn: () => discussionApi.getDiscussionById(params?.id)
    });

    const {
        data: commentsData,
        refetch,
        isLoading
    } = useQuery({
        queryKey: ['teacherCommentsByDiscussion', { params: params?.id, page, filter }],
        queryFn: () =>
            discussionApi.getCommentsByDiscussionId(
                params?.id,
                page - 1,
                rowsPerPage,
                filter == 1 ? 'reactCount' : 'createTime',
                'DESC'
            )
    });

    useEffect(() => {
        if (commentsData?.data) {
            setComments(commentsData.data);
            setTotalPage(commentsData.totalPage);
            setTotalRow(commentsData.totalRow);
        }
    }, [commentsData]);

    const { control, handleSubmit, setError, reset } = useForm({
        defaultValues: {
            title: '',
            course: '',
            description: ''
        }
    });

    useEffect(() => {
        if (commentsData?.data) {
            setComments(commentsData.data);
        }
    }, [commentsData]);

    const {
        onOpen,
        onClose,
        onContentType,
        reportType,
        description,
        contentType,
        onReportType,
        onDescription,
        onFile,
        file,
        onSubmitting
    } = useReportModal();

    const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[]>([]);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setUploadedFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, fileRejections }: DropzoneRootProps = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1,
        multiple: false
    });

    const onSubmit = async (formData: any) => {
        try {
            setIsSubmitting(true);
            const formDataWithImage = new FormData();
            formDataWithImage.append('content', formData.response);
            formDataWithImage.append('commentParentId', '-1');
            if (uploadedFiles.length > 0) {
                formDataWithImage.append('image', uploadedFiles[0]); // assuming 'image' is the field name expected by the server
            }
            const response = await discussionApi.createComment(formDataWithImage, discussionData?.id);
            if (response) {
                refetch();
                setIsSubmitting(false);
                reset();
                setUploadedFiles([]);
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error('Error creating course:', error);
        }
    };

    const onSubmitReport = async () => {
        const toastLoading = toast.loading('Đang gửi yêu cầu');
        try {
            onSubmitting(true);
            const formDataWithImage = new FormData();
            formDataWithImage.append('reportMsg', description);
            formDataWithImage.append('reportType', reportType.toUpperCase());
            if (file) {
                formDataWithImage.append('image', file); // assuming 'image' is the field name expected by the server
            }
            if (contentType == 'discussion') {
                const response = await discussionApi.createConversationReport(formDataWithImage, discussionData?.id);
                if (response) {
                    toast.dismiss(toastLoading);
                    onSubmitting(false);
                    toast.success('Đã gửi thành công');
                    onDescription('');
                    onReportType('integrity');
                    onFile(null);
                    onClose();
                }
            } else if (contentType == 'comment') {
                if (reportCommentId) {
                    const response = await discussionApi.createCommentReport(formDataWithImage, reportCommentId);
                    if (response) {
                        toast.dismiss(toastLoading);
                        onSubmitting(false);
                        toast.success('Đã gửi thành công');
                        onDescription('');
                        onReportType('integrity');
                        onFile(null);
                        onClose();
                    }
                }
            }
        } catch (error) {
            toast.dismiss(toastLoading);
            onSubmitting(false);
            toast.error('Hệ thống đang gặp trục trực. Vui lòng thử lại sau ít phút');
            console.error('Error creating course:', error);
        }
    };

    const openReportModal = () => {
        onContentType('discussion');
        onOpen();
    };

    const postContent = {
        id: discussionData?.id,
        title: discussionData?.title,
        content: discussionData?.content,
        imageUrl: discussionData?.imageUrl,
        owner: discussionData?.owner,
        reacted: discussionData?.reacted,
        auth: discussionData?.ownerFullName,
        like: discussionData?.reactCount,
        avatar: discussionData?.ownerAvatar,
        createTime: discussionData?.createTime
    };
    console.log(postContent);

    if (!discussionData) return <Loader />;
    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };
    return (
        <div className="w-[98%] lg:w-[90%] mx-auto mb-8">
            <div className="flex justify-between items-center">
                <Button variant="flat" onClick={() => router.back()} className="flex items-center gap-1">
                    <BsArrowLeft />
                    <span>Quay lại</span>
                </Button>
                {!discussionData?.owner && (
                    <Button color="danger" onClick={openReportModal}>
                        Báo cáo
                    </Button>
                )}
            </div>
            <PostTitle postContent={postContent} from="teacher" refetch={refetchDiscussion} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-4 items-center">
                    <div className="h-[100px] w-[160px] border-2 rounded-lg border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer mt-4">
                        <div {...getRootProps()}>
                            <input {...getInputProps()} name="avatar" />
                            {uploadedFiles.length ? (
                                <div className="group relative">
                                    <Image
                                        className="object-cover w-full h-[100px]"
                                        key={uploadedFiles[0].path}
                                        src={URL.createObjectURL(uploadedFiles[0])}
                                        alt={uploadedFiles[0].path as string}
                                        width={160}
                                        height={100}
                                    />
                                    <div className="absolute top-0 right-0 bottom-0 left-0 hidden text-white group-hover:flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)]">
                                        <RiImageEditLine size={28} />
                                        <span className="text-sm">Cập nhật ảnh</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col justify-center items-center">
                                    <RiImageAddLine size={28} />
                                    <span className="text-sm">Thêm ảnh</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-[1] relative">
                        <InputFormula name="response" placeholder="Viết suy nghĩ của bạn" control={control} />
                        <Button
                            className="absolute right-2 bottom-[-40px] !min-w-[40px] w-[40px] h-[40px] rounded-full mb-2 cursor-pointer"
                            color="primary"
                            type="submit"
                            variant="light"
                            size="sm"
                            isLoading={isSubmitting}
                        >
                            <IoMdSend size={20} />
                        </Button>
                    </div>
                </div>
            </form>

            <div className="w-full mt-20">
                <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-semibold">Phản hồi</h3>
                    <Select
                        size="sm"
                        label="Sắp xếp theo"
                        color="primary"
                        variant="bordered"
                        defaultSelectedKeys={['0']}
                        className="w-[240px] mt-4"
                        onChange={event => setFilter(Number(event.target.value))}
                    >
                        <SelectItem key={0} value={0}>
                            Thời gian
                        </SelectItem>
                        <SelectItem key={1} value={1}>
                            Tương tác
                        </SelectItem>
                    </Select>
                </div>
                <Card className="mt-8 p-8">
                    {isLoading ? (
                        <div className="flex justify-center">
                            <PuffLoader color="blue" size={50} />
                        </div>
                    ) : (
                        <ul>
                            {comments?.length ? (
                                comments?.map((commentInfo: any) => (
                                    <CommentItem
                                        refetch={refetch}
                                        key={commentInfo?.id}
                                        commentInfo={commentInfo}
                                        onCommentId={setReportCommentId}
                                    />
                                ))
                            ) : (
                                <div>Chưa có phản hồi</div>
                            )}
                            {totalPage && totalPage > 1 ? (
                                <div className="flex justify-center mb-16">
                                    <Pagination
                                        page={page}
                                        total={totalPage}
                                        onChange={value => scrollToTop(value)}
                                        showControls
                                    />
                                </div>
                            ) : null}
                        </ul>
                    )}

                    {/* <Button className="w-full">Xem thêm</Button> */}
                </Card>
            </div>
            <ReportModal onReport={onSubmitReport} />
        </div>
    );
};

export default PostDetail;
