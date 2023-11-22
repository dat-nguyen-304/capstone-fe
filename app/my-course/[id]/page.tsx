'use client';

import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import Feedback from '@/components/course/course-detail/Feedback';
import WriteFeedback from '@/components/course/course-detail/WriteFeedback';
import CourseImage from '@/components/course/course-detail/CourseImage';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import { courseApi, ratingCourseApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';

interface CourseDetailProps {
    params: { id: number };
}
const CourseInfoTest = {
    updateDate: '2023-11-11T23:34:48.088886',
    courseName: 'Lập Trình C++',
    subject: 'Lập Trình',
    level: 'Cơ bản',
    rating: 4.7,
    numberOfRate: 100,
    totalStudent: 100,
    teacherName: 'Bùi Đức Tiến',
    description:
        'Khóa học lập trình C++ từ cơ bản tới nâng cao dành cho người mới bắt đầu. Mục tiêu của khóa học này nhằm giúp các bạn nắm được các khái niệm căn cơ của lập trình, giúp các bạn có nền tảng vững chắc để chinh phục con đường trở thành một lập trình viên.'
};
const CourseDetail: React.FC<CourseDetailProps> = ({ params }) => {
    const { data: courseData, isLoading } = useQuery<any>({
        queryKey: ['my-course-detail'],
        queryFn: () => courseApi.getCourseById(params?.id)
    });
    const { data: feedbacksData } = useQuery<any>({
        queryKey: ['feedbacks'],
        queryFn: () => ratingCourseApi.getRatingCourseById(params?.id, 0, 100)
    });

    const courseInfo = {
        courseName: courseData?.name as string,
        subject: courseData?.subject,
        level: courseData?.level,
        teacherName: courseData?.teacherName,
        numberOfRate: courseData?.numberOfRate,
        rating: courseData?.rating,
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
        totalVideo: courseData?.totalVideo
    };

    const courseContent = {
        id: courseData?.id,
        totalVideo: courseData?.totalVideo,
        listVideo: courseData?.courseVideoResponses
    };
    console.log(courseData);
    console.log(feedbacksData);
    const handleFeedbackSubmission = async (feedback: { rating: number; comment: string }) => {
        try {
            const ratingCourse = {
                courseId: Number(params?.id),
                rating: Number(feedback.rating),
                content: feedback.comment
            };
            const res = await ratingCourseApi.createRating(ratingCourse);
            console.log(res);
            // console.log(ratingCourse);
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };
    if (!courseData) return <Loader />;
    return (
        <div className="w-[90%] lg:w-4/5 mx-auto">
            <Link href="/my-course" className="mt-4 flex items-center gap-2 text-sm">
                <BsArrowLeft />
                <span>Quay lại</span>
            </Link>
            <div className="relative grid grid-cols-10 gap-2 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo courseInfo={courseInfo} />
                    <CourseContent isMyCourse={true} courseContent={courseContent} />
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
