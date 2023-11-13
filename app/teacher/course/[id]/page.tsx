'use client';

import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import CourseRevenueModal from '@/components/course/course-detail/CourseRevenueModal';
import EditCourse from '@/components/course/course-detail/EditCouse';
import Feedback from '@/components/course/course-detail/Feedback';
import { useDisclosure } from '@nextui-org/react';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';

interface CourseDetailProps {}

const CourseInfoTest = {
    createDate: '2023-11-11T23:34:48.088886',
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

const CourseDetail: React.FC<CourseDetailProps> = ({}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <div className="w-[98%] xl:w-[90%] mx-auto">
            <Link href="/teacher/course/my-course" className="mt-4 inline-flex items-center gap-2 text-sm">
                <BsArrowLeft />
                <span>Quay lại</span>
            </Link>
            <div className="relative grid grid-cols-10 gap-2 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo courseInfo={CourseInfoTest} />
                    <CourseContent />
                    <Feedback />
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <EditCourse onOpen={onOpen} />
                </div>
            </div>
            <CourseRevenueModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </div>
    );
};

export default CourseDetail;
