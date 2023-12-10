'use client';

import { BsArrowLeft } from 'react-icons/bs';
import Image from 'next/image';
import { Button } from '@nextui-org/react';
import { useReportModal, useUser } from '@/hooks';
import { useEffect, useState } from 'react';
import { SafeUser } from '@/types';
import { handleUserReload } from '@/utils/handleUserReload';
import Loader from '../Loader';
import NotFound from '@/app/not-found';
import { useRouter } from 'next/navigation';
import { ReportModal } from '../modal';
import { toast } from 'react-toastify';
import { courseApi, examApi, reportVideoApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
interface VideoHeaderProps {
    children: React.ReactNode;
    id: number;

    course: any;
    type: 'video' | 'quiz';
}

const VideoHeader: React.FC<VideoHeaderProps> = ({ children, id, type, course }) => {
    const currentUser = useUser();
    const [user, setUser] = useState<SafeUser | null>(currentUser.user);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {
        isOpen,
        onOpen,
        onClose,
        onContentType,
        onReportType,
        contentType,
        onDescription,
        onFile,
        description,
        reportType,
        file
    } = useReportModal();
    const router = useRouter();

    const { data: quizCourse } = useQuery<any>({
        queryKey: ['my-course-quiz', { course }],
        queryFn: () => examApi.getQuizCourseById(course?.id)
    });
    const goBack = () => {
        if (course?.id) {
            router.push(`/my-course/${course?.id}`);
        } else {
            router.back();
        }
    };
    useEffect(() => {
        const handleReload = async () => {
            if (!currentUser.user && user) {
                setUser(null);
                setIsLoading(false);
            } else if (!currentUser.user) {
                try {
                    setIsLoading(true);
                    const userSession = await handleUserReload();
                    if (userSession) currentUser.onChangeUser(userSession as SafeUser);
                    setUser(userSession);
                    setIsLoading(false);
                } catch (error) {
                    currentUser.onChangeUser(null);
                    setUser(null);
                    setIsLoading(false);
                }
            } else setIsLoading(false);
        };
        handleReload();
    }, [currentUser.user]);

    const onSubmitReport = async () => {
        let toastLoading;
        try {
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            const formDataPayload = new FormData();
            if (file) {
                formDataPayload.append('image', file);
            }
            if (contentType == 'video') {
                const reportRequest = {
                    content: description,
                    objectId: id,
                    reportType: reportType.toUpperCase()
                };
                formDataPayload.append(
                    'reportRequest',
                    new Blob([JSON.stringify(reportRequest)], { type: 'application/json' })
                );
                const response = await reportVideoApi.createVideoReport(formDataPayload);

                if (response) {
                    onDescription('');
                    onReportType('integrity');
                    onFile(null);
                    toast.success('Báo cáo video thành công');
                    onClose();
                }
                toast.dismiss(toastLoading);
            } else if (contentType == 'quiz') {
                formDataPayload.append('reportMsg', description);
                formDataPayload.append('reportType', reportType.toUpperCase());
                const response = await examApi.createExamReport(formDataPayload, id);
                if (response) {
                    onDescription('');
                    onReportType('integrity');
                    onFile(null);
                    toast.success('Bài kiểm tra được báo cáo thành công');
                    onClose();
                }
                toast.dismiss(toastLoading);
            }
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error creating course:', error);
        }
    };
    const openReportModal = () => {
        onContentType(type);
        onOpen();
    };

    if (isLoading) return <Loader />;

    if (user?.role !== 'STUDENT') return <NotFound />;

    return (
        <>
            <div className="h-[60px] bg-blue-400 flex items-center justify-between px-2 sm:px-8">
                <div className="flex items-center gap-4">
                    {/* <Link href={`/course/${id || '1'}`}> */}
                    <Button className="text-sm p-0" size="sm" onClick={() => goBack()}>
                        <BsArrowLeft />
                    </Button>
                    {/* </Link> */}
                    <Image
                        src="https://intaadvising.gatech.edu/wp-content/uploads/2020/11/cepa.png"
                        width={60}
                        height={60}
                        alt=""
                        className="hidden sm:block"
                    />
                    <p className="text-white text-xs sm:text-sm">{course?.name || 'Khóa học lấy gốc thần tốc'}</p>
                </div>
                <div className="flex justify-center items-center text-white">
                    <div className="hidden lg:block">
                        <span className="inline-flex items-center text-xs">
                            <span className="font-bold mr-1">{course?.totalVideo || '20'}</span>
                            <span>Bài giảng</span>
                            <Image src="/video-number/blue.svg" width={30} height={30} alt="" />
                        </span>
                        <span className="before:content-['•'] before:inline-block before:text-white before:mx-2">
                            <span className="inline-flex items-center text-xs">
                                <span className="font-bold mr-1">{quizCourse?.totalRow || 0}</span>
                                <span>Bài tập</span>
                                <Image src="/video-number/red.svg" width={30} height={30} alt="" />
                            </span>
                        </span>
                        <span className="before:content-['•'] before:inline-block before:text-white before:mx-2">
                            <span className="inline-flex items-center text-xs">
                                <span className="mr-1">Đã học</span>
                                <span className="font-bold">
                                    {`${course?.totalCompleted || 5} / ${course?.totalVideo || 10}`}
                                </span>
                                <Image src="/video-number/green.svg" width={30} height={30} alt="" />
                            </span>
                        </span>
                    </div>
                    <Button className="ml-8" color="danger" variant="solid" size="sm" onClick={openReportModal}>
                        Báo cáo
                    </Button>
                </div>
                <ReportModal onReport={onSubmitReport} />
            </div>
            {children}
        </>
    );
};

export default VideoHeader;
