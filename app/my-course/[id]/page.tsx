'use client';

import CourseContent from '@/components/course/course-detail/CourseContent';
import CourseInfo from '@/components/course/course-detail/CourseInfo';
import Feedback from '@/components/course/course-detail/Feedback';
import WriteFeedback from '@/components/course/course-detail/WriteFeedback';
import CourseImage from '@/components/course/course-detail/CourseImage';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';

interface CourseDetailProps {}
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
const CourseDetail: React.FC<CourseDetailProps> = ({}) => {
    return (
        <div className="w-[90%] lg:w-4/5 mx-auto">
            <Link href="/my-course" className="mt-4 flex items-center gap-2 text-sm">
                <BsArrowLeft />
                <span>Quay lại</span>
            </Link>
            <div className="relative grid grid-cols-10 gap-2 mt-4 mb-16">
                <div className="col-span-10 order-last md:col-span-7 md:order-first">
                    <CourseInfo courseInfo={CourseInfoTest} />
                    <CourseContent isMyCourse={true} />
                    <WriteFeedback />
                    <Feedback />
                </div>
                <div className="col-span-10 order-first md:col-span-3 md:order-last">
                    <CourseImage />
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
