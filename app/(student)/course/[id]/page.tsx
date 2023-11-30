'use client';

import BuyCourse from '@/components/course/course-detail/BuyCourse';
import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import Feedback from '@/components/course/course-detail/Feedback';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import { courseApi, examApi, ratingCourseApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
interface CourseDetailProps {
    params: { id: number };
}

const CourseDetail: React.FC<CourseDetailProps> = ({ params }) => {
    const router = useRouter();
    const { data, isLoading } = useQuery<any>({
        queryKey: ['course', { params: params?.id }],
        queryFn: () => courseApi.getCourseById(params?.id)
    });
    const { data: quizCourse } = useQuery<any>({
        queryKey: ['course-quiz', { params: params?.id }],
        queryFn: () => examApi.getQuizCourseById(params?.id)
    });

    const { data: feedbacksData } = useQuery<any>({
        queryKey: ['feedbacksCourse'],
        queryFn: () => ratingCourseApi.getRatingCourseById(params?.id, 0, 100)
    });
    console.log(data);

    const courseInfo = {
        courseName: data?.name as string,
        subject: data?.subject,
        level: data?.level,
        teacherName: data?.teacherName,
        teacherEmail: data?.teacherEmail,
        teacherId: data?.teacherId,
        teacherAvatar: data?.teacherAvatar,
        numberOfRate: data?.numberOfRate,
        rating: data?.rating,
        totalStudent: data?.totalStudent,
        description: data?.description,
        updateDate: data?.updateDate
    };
    const buyCourse = {
        id: data?.id,
        thumbnail: data?.thumbnail,
        price: data?.price,
        subject: data?.subject,
        level: data?.level,
        totalVideo: data?.totalVideo,
        totalQuiz: quizCourse?.totalRow
    };
    const courseContent = {
        id: data?.id,
        totalVideo: data?.totalVideo,
        listVideo: [...(data?.courseVideoResponses || []), ...(quizCourse?.data || [])],
        totalCompleted: data?.totalCompleted,
        totalQuiz: quizCourse?.totalRow
    };

    if (!data) return <Loader />;
    return (
        <div className="w-[90%] lg:w-4/5 mx-auto">
            <div className="mt-8 flex items-center gap-2 text-sm cursor-pointer" onClick={() => router.back()}>
                <BsArrowLeft />
                <span>Quay lại</span>
            </div>
            <div className="relative grid grid-cols-10 gap-2 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo courseInfo={courseInfo} />
                    <CourseContent courseContent={courseContent} />
                    <Feedback feedbacksData={feedbacksData} />
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <BuyCourse buyCourse={buyCourse} />
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
