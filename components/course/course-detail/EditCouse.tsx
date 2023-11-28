'use client';

import { Button, Chip } from '@nextui-org/react';
import Image from 'next/image';
import { SiGoogleanalytics, SiLevelsdotfyi, SiStatuspage } from 'react-icons/si';
import { TfiVideoClapper } from 'react-icons/tfi';
import { FaBookReader } from 'react-icons/fa';
import Link from 'next/link';
import { BiSolidPencil } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import { courseStatusColorMap } from '@/utils';
import { courseApi } from '@/api-client';
import { useCustomModal } from '@/hooks';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface EditCourseProps {
    onOpenPopup: () => void;
    refetch?: any;
    type?: 'teacher';
    editCourse: {
        id: number;
        thumbnail: string;
        price: number;
        subject: string;
        level: string;
        totalVideo: number;
        status: string;
    };
}

const EditCourse: React.FC<EditCourseProps> = ({ onOpenPopup, editCourse, refetch }) => {
    const router = useRouter();
    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();
    let status = '';
    if (editCourse.status === 'AVAILABLE') status = 'Hoạt động';
    else if (editCourse.status === 'WAITING') status = 'Chờ xác thực';
    else if (editCourse.status === 'REJECT') status = 'Đã từ chối';
    else if (editCourse.status === 'BANNED') status = 'Đã Xóa';
    else if (editCourse.status === 'UPDATING') status = 'Chờ cập nhật';
    else if (editCourse.status === 'DRAFT') status = 'Bản nháp';
    else status = 'Vô hiệu';

    const submitVerifyCourse = async () => {
        onClose();
        const toastLoading = toast.loading('Đang xử lí yêu cầu');
        try {
            const courseId = editCourse.id;
            const response = await courseApi.TeacherSendVerifyCourse([courseId]);
            if (response) {
                refetch();
                toast.success('Khóa học của đã được gửi duyệt thành công');
            }
            toast.dismiss(toastLoading);
            console.log(response);
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error verifying course:', error);
        }
    };

    const handleVerifyCourse = () => {
        onWarning({
            title: 'Gửi yêu cầu duyệt khóa học',
            content: 'Hãy chắc chắn rằng bạn đã cập nhật hoàn chỉnh khóa học trước khi gửi yêu cầu.',
            activeFn: submitVerifyCourse
        });
        onOpen();
    };

    const handleDeleteCourse = async (courseId: number) => {
        try {
            console.log(editCourse?.status);
            if (editCourse.status === 'AVAILABLE') {
                const res = await courseApi.deleteCourse(courseId);
                if (!res.data.code) {
                    onSuccess({
                        title: 'Xóa khóa học',
                        content: 'Khóa học đã được xóa thành công'
                    });
                    router.push('/teacher/course/my-course');
                }
            } else {
                const res = await courseApi.deleteCourseDraft(courseId);
                if (!res.data.code) {
                    onSuccess({
                        title: 'Xóa khóa học',
                        content: 'Khóa học đã được xóa thành công'
                    });
                    router.push('/teacher/course/my-course-draft');
                }
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
    const onApproveDeleteOpen = (courseId: number) => {
        onWarning({
            title: 'Xác nhận xóa',
            content: 'Video sẽ bị xóa sau khi bạn duyệt, hành động không dược hoàn tác. Bạn chắc chứ?',
            activeFn: () => handleDeleteCourse(courseId)
        });
        onOpen();
    };

    return (
        <div className="sticky top-[70px] mb-8 md:mb-0">
            <Image
                src={editCourse.thumbnail || '/banner/slide-1.png'}
                width={600}
                height={300}
                alt=""
                className="w-full rounded-xl h-[200px] object-cover object-center"
            />
            <div className="flex justify-center flex-col items-center">
                <p className="text-center text-2xl text-orange-500 mt-4 font-bold">
                    ₫ {editCourse.price.toLocaleString('vi-VN')}{' '}
                </p>
                {editCourse.status === 'DRAFT' || editCourse.status === 'UPDATING' ? (
                    <Button
                        color="success"
                        className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base text-white hover:text-gray-200"
                        onClick={handleVerifyCourse}
                    >
                        Gửi yêu cầu duyệt
                    </Button>
                ) : null}
                {editCourse?.status != 'WAITING' ? (
                    <Button
                        as={Link}
                        href={
                            editCourse?.status == 'DRAFT' ||
                            editCourse?.status == 'UPDATING' ||
                            editCourse?.status == 'REJECT' ||
                            editCourse?.status == 'WAITING'
                                ? `/teacher/course/my-course-draft/edit/${editCourse?.id}`
                                : `/teacher/course/edit/${editCourse?.id}`
                        }
                        color="warning"
                        className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base text-white hover:text-gray-200"
                    >
                        Chỉnh sửa <BiSolidPencil />
                    </Button>
                ) : null}
                {editCourse.status != 'WAITING' ? (
                    <Button
                        color="danger"
                        onClick={() => onApproveDeleteOpen(editCourse?.id)}
                        className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base hover:text-gray-200"
                    >
                        Xóa khóa học <FaTrash />
                    </Button>
                ) : null}

                {editCourse.status === 'AVAILABLE' ? (
                    <Button
                        color="primary"
                        className="w-1/2 md:w-4/5 !mt-4 rounded-full text-base hover:text-white"
                        onClick={onOpenPopup}
                    >
                        Doanh thu <SiGoogleanalytics />
                    </Button>
                ) : null}

                <div className="hidden md:block">
                    <div className="flex items-center my-4">
                        <SiLevelsdotfyi className="mr-8" />
                        <span className="text-sm">
                            {editCourse.subject} - {editCourse.level}
                        </span>
                    </div>
                    <div className="flex items-center my-4">
                        <TfiVideoClapper className="mr-8" />
                        <span className="text-sm">{editCourse.totalVideo} bài giảng </span>
                    </div>
                    <div className="flex items-center my-4">
                        <FaBookReader className="mr-8" />
                        <span className="text-sm">0 bài tập</span>
                    </div>
                    <div className="flex items-center my-4">
                        <SiStatuspage className="mr-6" />
                        <Chip
                            className="capitalize border-none gap-1 text-default-600"
                            color={courseStatusColorMap[editCourse.status]}
                            size="sm"
                            variant="dot"
                        >
                            {status}
                        </Chip>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCourse;
