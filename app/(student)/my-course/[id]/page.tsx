'use client';

import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import Feedback from '@/components/course/course-detail/Feedback';
import WriteFeedback from '@/components/course/course-detail/WriteFeedback';
import CourseImage from '@/components/course/course-detail/CourseImage';
import { BsArrowLeft } from 'react-icons/bs';
import { courseApi, examApi, ratingCourseApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface CourseDetailProps {
    params: { id: number };
}

const CourseDetail: React.FC<CourseDetailProps> = ({ params }) => {
    const router = useRouter();
    const {
        data: courseData,
        isLoading,
        refetch: refetchCourse
    } = useQuery<any>({
        queryKey: ['my-course-detail', { params: params?.id }],
        queryFn: () => courseApi.getCourseById(params?.id)
    });
    const { data: quizCourse } = useQuery<any>({
        queryKey: ['my-course-quiz', { params: params?.id }],
        queryFn: () => examApi.getQuizCourseById(params?.id)
    });
    const { data: feedbacksData, refetch } = useQuery<any>({
        queryKey: ['feedbacks'],
        queryFn: () => ratingCourseApi.getRatingCourseById(params?.id, 0, 100)
    });
    const attemptedQuizzes = quizCourse?.data?.filter((quiz: any) => quiz.attempted);
    const numberOfAttemptedQuizzes = attemptedQuizzes ? attemptedQuizzes.length : 0;

    const courseInfo = {
        courseName: courseData?.name as string,
        subject: courseData?.subject,
        level: courseData?.level,
        teacherName: courseData?.teacherName,
        teacherEmail: courseData?.teacherEmail,
        teacherAvatar: courseData?.teacherAvatar,
        numberOfRate: courseData?.numberOfRate,
        rating: courseData?.rating,
        topics: courseData?.topics,
        totalStudent: courseData?.totalStudent,
        description: courseData?.description,
        updateDate: courseData?.updateDate
    };
    const courseImage = {
        id: courseData?.id,
        thumbnail: courseData?.thumbnail,
        price: courseData?.price,
        subject: courseData?.subject,
        level: courseData?.level,
        totalVideo: courseData?.totalVideo,
        progress: courseData?.progress,
        totalQuiz: quizCourse?.totalRow,
        totalCompleted: courseData?.totalCompleted
    };

    const courseContent = {
        id: courseData?.id,
        totalVideo: courseData?.totalVideo,
        listVideo: [...(courseData?.courseVideoResponses || []), ...(quizCourse?.data || [])].sort((a, b) => {
            const aOrder = a.ordinalNumber || a.courseOrder || 0;
            const bOrder = b.ordinalNumber || b.courseOrder || 0;
            return aOrder - bOrder;
        }),
        totalQuiz: quizCourse?.totalRow,
        totalCompleted: courseData?.totalCompleted
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
    if (!courseData) return <Loader />;
    return (
        <div className="w-[90%] lg:w-4/5 mx-auto">
            <div
                onClick={() => router.push('/my-course')}
                className="mt-4 flex items-center gap-2 text-sm cursor-pointer"
            >
                <BsArrowLeft />
                <span>Quay lại</span>
            </div>
            <div className="relative grid grid-cols-10 gap-2 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo courseInfo={courseInfo} />
                    <CourseContent type="my-course" courseContent={courseContent} />
                    <WriteFeedback onSubmit={handleFeedbackSubmission} />
                    <Feedback feedbacksData={feedbacksData} />
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <CourseImage courseImage={courseImage} />
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
