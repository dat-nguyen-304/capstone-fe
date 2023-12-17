'use client';

import BuyCourse from '@/components/course/course-detail/BuyCourse';
import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import Feedback from '@/components/course/course-detail/Feedback';
import { BsArrowLeft } from 'react-icons/bs';
import { courseApi, examApi, ratingCourseApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import WriteFeedback from '@/components/course/course-detail/WriteFeedback';
import { toast } from 'react-toastify';
interface CourseDetailProps {
    params: { id: number };
}

const CourseDetail: React.FC<CourseDetailProps> = ({ params }) => {
    const router = useRouter();
    const {
        data,
        isLoading,
        refetch: refetchCourse
    } = useQuery<any>({
        queryKey: ['course', { params: params?.id }],
        queryFn: () => courseApi.getCourseById(params?.id)
    });
    const { data: quizCourse } = useQuery<any>({
        queryKey: ['course-quiz', { params: params?.id }],
        queryFn: () => examApi.getQuizCourseById(params?.id)
    });

    const { data: feedbacksData, refetch } = useQuery<any>({
        queryKey: ['feedbacksCourse'],
        queryFn: () => ratingCourseApi.getRatingCourseById(params?.id, 0, 100)
    });

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
        topics: data?.topics,
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
        totalQuiz: quizCourse?.totalRow,
        isAccess: data?.isAccess
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
    const handleFeedbackSubmission = async (feedback: { rating: number; comment: string }) => {
        let toastLoading;
        try {
            toastLoading = toast.loading('Đang tạo bài đăng');
            const ratingCourse = {
                courseId: Number(params?.id),
                rating: Number(feedback.rating),
                content: feedback.comment
            };
            const res = await ratingCourseApi.createRating(ratingCourse);
            if (res) {
                toast.success('Bình luận khóa học thành công');
                refetch();
                refetchCourse();
            }
            toast.dismiss(toastLoading);
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error submitting feedback:', error);
        }
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
                    {data?.isAccess ? <WriteFeedback onSubmit={handleFeedbackSubmission} /> : null}
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
