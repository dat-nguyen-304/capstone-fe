'use client';

import Loader from '@/components/Loader';
import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import Feedback from '@/components/course/course-detail/Feedback';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import { courseApi, examApi, ratingCourseApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import ApproveCourse from '@/components/course/course-detail/ApproveCourse';
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
        queryKey: ['admin-view-course-quiz', { params: params?.id }],
        queryFn: () => examApi.getQuizCourseById(params?.id)
    });

    const { data: feedbacksData } = useQuery<any>({
        queryKey: ['feedbacksAdmin'],
        queryFn: () => ratingCourseApi.getRatingCourseById(params?.id, 0, 100)
    });
    const courseInfo = {
        courseName: data?.name as string,
        subject: data?.subject,
        level: data?.level,
        teacherName: data?.teacherName,
        teacherEmail: data?.teacherEmail,
        teacherAvatar: data?.teacherAvatar,
        numberOfRate: data?.numberOfRate,
        rating: data?.rating,
        topics: data?.topics,
        totalStudent: data?.totalStudent,
        description: data?.description,
        updateDate: data?.updateDate
    };

    const approveCourse = {
        id: data?.id,
        thumbnail: data?.thumbnail,
        price: data?.price,
        subject: data?.subject,
        level: data?.level,
        totalVideo: data?.totalVideo,
        status: data?.status,
        totalQuiz: quizCourse?.totalRow
    };

    const courseContent = {
        id: data?.id,
        totalVideo: data?.totalVideo,
        listVideo: [...(data?.courseVideoResponses || []), ...(quizCourse?.data || [])].sort((a, b) => {
            const aOrder = a.ordinalNumber || a.courseOrder || 0;
            const bOrder = b.ordinalNumber || b.courseOrder || 0;
            return aOrder - bOrder;
        }),
        totalCompleted: data?.totalCompleted,
        totalQuiz: quizCourse?.totalRow
    };

    if (!data) return <Loader />;

    return (
        <div className="w-[98%] xl:w-[94%] mx-auto">
            <div className="mt-4 inline-flex items-center gap-2 text-sm cursor-pointer" onClick={() => router.back()}>
                <BsArrowLeft />
                <span>Quay lại</span>
            </div>
            <div className="relative grid grid-cols-10 gap-4 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo courseInfo={courseInfo} />
                    <CourseContent courseContent={courseContent} type="admin-view" />
                    <Feedback feedbacksData={feedbacksData} />
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <ApproveCourse approveCourse={approveCourse} />
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
