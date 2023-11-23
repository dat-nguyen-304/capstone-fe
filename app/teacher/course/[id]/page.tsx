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
import { courseApi, ratingCourseApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
interface CourseDetailProps {
    params: { id: number };
}

// const CourseInfoTest = {
//     createDate: '2023-11-11T23:34:48.088886',
//     courseName: 'Lập Trình C++',
//     subject: 'Lập Trình',
//     level: 'Cơ bản',
//     rating: 4.7,
//     numberOfRate: 100,
//     totalStudent: 100,
//     teacherName: 'Bùi Đức Tiến',
//     description:
//         'Khóa học lập trình C++ từ cơ bản tới nâng cao dành cho người mới bắt đầu. Mục tiêu của khóa học này nhằm giúp các bạn nắm được các khái niệm căn cơ của lập trình, giúp các bạn có nền tảng vững chắc để chinh phục con đường trở thành một lập trình viên.'
// };

const CourseDetail: React.FC<CourseDetailProps> = ({ params }) => {
    const router = useRouter();
    const { data, isLoading } = useQuery<any>({
        queryKey: ['course'],
        queryFn: () => courseApi.getCourseByIdForAdminAndTeacher(params?.id)
    });
    const { data: feedbacksData } = useQuery<any>({
        queryKey: ['feedbacksCourseTeacher'],
        queryFn: () => ratingCourseApi.getRatingCourseById(params?.id, 0, 100)
    });
    console.log(data);

    const courseInfo = {
        courseName: data?.name as string,
        subject: data?.subject,
        level: data?.level,
        teacherName: data?.teacherName,
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
        totalVideo: data?.totalVideo,
        status: data?.status
    };
    const courseContent = {
        id: data?.id,
        totalVideo: data?.totalVideo,
        listVideo: data?.courseVideoResponses
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
                    <CourseContent courseContent={courseContent} isTeacherCourse={true} />
                    <Feedback feedbacksData={feedbacksData} />
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <EditCourse onOpen={onOpen} editCourse={editCourse} />
                </div>
            </div>
            <CourseRevenueModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </div>
    );
};

export default CourseDetail;
