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
import { useEffect, useState } from 'react';
interface CourseApproveDetailProps {
    params: { id: number };
}

const CourseApproveDetail: React.FC<CourseApproveDetailProps> = ({ params }) => {
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const { data, isLoading } = useQuery<any>({
        queryKey: ['course', { params: params?.id }],
        queryFn: () => courseApi.getCourseDraftById(params?.id)
    });

    const { data: quizCourse } = useQuery<any>({
        queryKey: ['admin-review-course-draft-quiz', { params: params?.id }],
        queryFn: () => examApi.getQuizCourseById(params?.id)
    });
    const { data: quizCourseRealId } = useQuery<any>({
        queryKey: ['admin-review-course-draft-realId-quiz', { params: data?.courseRealId }],
        queryFn: () => (data?.courseRealId ? examApi.getQuizCourseById(data?.courseRealId) : Promise.resolve(null))
    });
    useEffect(() => {
        if (quizCourse || quizCourseRealId) {
            setQuizzes([...(quizCourse?.data || []), ...(quizCourseRealId?.data || [])]);
        }
    }, [quizCourse, quizCourseRealId]);

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
        updateDate: data?.updateDate
    };

    const approveCourse = {
        id: data?.id,
        thumbnail: data?.thumbnail,
        price: data?.price,
        subject: data?.subject,
        level: data?.level,
        totalVideo: data?.courseVideoResponses?.length,
        status: data?.status,
        totalQuiz: quizzes?.length
    };

    const courseContent = {
        id: data?.id,
        totalVideo: data?.courseVideoResponses?.length,
        listVideo: [...(data?.courseVideoResponses || []), ...(quizzes || [])].sort((a, b) => {
            const aOrder = a.ordinalNumber || a.courseOrder || 0;
            const bOrder = b.ordinalNumber || b.courseOrder || 0;
            return aOrder - bOrder;
        }),
        totalCompleted: data?.totalCompleted,
        totalQuiz: quizzes?.length
    };

    console.log(data);

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
                    <CourseContent courseContent={courseContent} type="admin-review" />
                    {/* <Feedback feedbacksData={feedbacksData} /> */}
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <ApproveCourse approveCourse={approveCourse} />
                </div>
            </div>
        </div>
    );
};

export default CourseApproveDetail;
