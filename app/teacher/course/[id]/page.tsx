'use client';

import Loader from '@/components/Loader';
import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import CourseRevenueModal from '@/components/course/course-detail/CourseRevenueModal';
import EditCourse from '@/components/course/course-detail/EditCouse';
import Feedback from '@/components/course/course-detail/Feedback';
import { useDisclosure } from '@nextui-org/react';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import { courseApi, examApi, ratingCourseApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
interface CourseDetailProps {
    params: { id: number };
}

const CourseDetail: React.FC<CourseDetailProps> = ({ params }) => {
    const router = useRouter();
    const { data, isLoading } = useQuery<any>({
        queryKey: ['course', { params: params?.id }],
        queryFn: () => courseApi.getCourseByIdForAdminAndTeacher(params?.id)
    });
    const { data: quizCourse } = useQuery<any>({
        queryKey: ['teacher-course-quiz', { params: params?.id }],
        queryFn: () => examApi.getQuizCourseById(params?.id)
    });

    const { data: feedbacksData } = useQuery<any>({
        queryKey: ['feedbacksCourseTeacher'],
        queryFn: () => ratingCourseApi.getRatingCourseById(params?.id, 0, 100)
    });

    const courseInfo = {
        courseName: data?.name as string,
        subject: data?.subject,
        level: data?.level,
        teacherName: data?.teacherName,
        teacherAvatar: data?.teacherAvatar,
        teacherEmail: data?.teacherEmail,
        numberOfRate: data?.numberOfRate,
        rating: data?.rating,
        totalStudent: data?.totalStudent,
        description: data?.description,
        updateDate: data?.updateDate,
        isDraft: data?.isDraft
    };
    const editCourse = {
        id: data?.id,
        thumbnail: data?.thumbnail,
        price: data?.price,
        subject: data?.subject,
        level: data?.level,
        totalVideo: data?.totalVideo,
        totalQuiz: quizCourse?.totalRow,
        status: data?.status
    };
    const courseContent = {
        id: data?.id,
        totalVideo: data?.courseVideoResponses?.length,
        listVideo: [...(data?.courseVideoResponses || []), ...(quizCourse?.data || [])],
        totalQuiz: quizCourse?.totalRow,
        totalCompleted: data?.totalCompleted
    };
    const { isOpen, onOpen, onClose } = useDisclosure();
    if (!data) return <Loader />;

    return (
        <div className="w-[98%] xl:w-[94%] mx-auto">
            <div onClick={() => router.back()} className="mt-4 inline-flex items-center gap-2 text-sm">
                <BsArrowLeft />
                <span>Quay lại</span>
            </div>
            <div className="relative grid grid-cols-10 gap-4 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo courseInfo={courseInfo} />
                    <CourseContent courseContent={courseContent} type="teacher-course" />
                    <Feedback feedbacksData={feedbacksData} />
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <EditCourse onOpenPopup={onOpen} editCourse={editCourse} />
                </div>
            </div>
            <CourseRevenueModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} courseId={params?.id} />
        </div>
    );
};

export default CourseDetail;
