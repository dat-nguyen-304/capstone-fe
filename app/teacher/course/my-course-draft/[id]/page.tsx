'use client';

import Loader from '@/components/Loader';
import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import CourseRevenueModal from '@/components/course/course-detail/CourseRevenueModal';
import EditCourse from '@/components/course/course-detail/EditCouse';
import Feedback from '@/components/course/course-detail/Feedback';
import { useDisclosure } from '@nextui-org/react';
import { BsArrowLeft } from 'react-icons/bs';
import { courseApi, examApi, ratingCourseApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface CourseDraftDetailProps {
    params: { id: number };
}
const CourseDraftDetail: React.FC<CourseDraftDetailProps> = ({ params }) => {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const router = useRouter();
    const { data, isLoading, refetch } = useQuery<any>({
        queryKey: ['course-draft', { params }],
        queryFn: () => courseApi.getCourseDraftById(params?.id)
    });

    const { data: quizCourse } = useQuery<any>({
        queryKey: ['teacher-course-draft-quiz', { params: params?.id }],
        queryFn: () => examApi.getQuizCourseById(params?.id)
    });
    const { data: quizCourseRealId } = useQuery<any>({
        queryKey: ['teacher-course-draft-quiz', { params: data?.courseRealId }],
        queryFn: () => (data?.courseRealId ? examApi.getQuizCourseById(data?.courseRealId) : Promise.resolve(null))
    });
    useEffect(() => {
        if (quizCourse || quizCourseRealId) {
            setQuizzes([...(quizCourse?.data || []), ...(quizCourseRealId?.data || [])]);
        }
    }, [quizCourse, quizCourseRealId]);
    console.log(quizzes);

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
    const editCourse = {
        id: data?.id,
        thumbnail: data?.thumbnail,
        price: data?.price,
        subject: data?.subject,
        level: data?.level,
        totalVideo: data?.courseVideoResponses?.length,
        totalQuiz: quizzes?.length,
        status: data?.status
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
    const { isOpen, onOpen, onClose } = useDisclosure();
    if (!data) return <Loader />;

    return (
        <div className="w-[98%] xl:w-[94%] mx-auto">
            <div onClick={() => router.back()} className="mt-4 inline-flex items-center gap-2 text-sm cursor-pointer">
                <BsArrowLeft />
                <span>Quay lại</span>
            </div>
            <div className="relative grid grid-cols-10 gap-4 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo courseInfo={courseInfo} type="draft" />
                    <CourseContent courseContent={courseContent} type="teacher-course-draft" />
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <EditCourse refetch={refetch} onOpenPopup={onOpen} editCourse={editCourse} />
                </div>
            </div>
            <CourseRevenueModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </div>
    );
};

export default CourseDraftDetail;
