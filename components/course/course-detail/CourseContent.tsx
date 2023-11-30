'use client';

import Image from 'next/image';
import VideoItem from './VideoItem';

interface CourseContentProps {
    type?: 'my-course' | 'teacher-course' | 'teacher-course-draft' | 'admin-review' | 'admin-view';
    isMyCourse?: boolean;
    isTeacherCourse?: boolean;
    isAdminReviewCourse?: boolean;
    courseContent?: any;
}

const CourseContent: React.FC<CourseContentProps> = ({ type, courseContent }) => {
    console.log(courseContent?.listVideo);

    if (courseContent?.listVideo?.length === 0) return <div></div>;
    return (
        <>
            <h3 className="mt-16 mb-8 font-bold text-lg text-slate-800 uppercase">Nội dung khóa học</h3>
            <div className="px-4 sm:px-8 mt-4 text-sm">
                <span className="inline-flex items-center">
                    <span className="font-bold mr-1">{courseContent?.totalVideo || 0}</span>
                    <span>Bài giảng</span>
                    <Image src="/video-number/blue.svg" width={30} height={30} alt="" />
                </span>
                <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                    <span className="inline-flex items-center">
                        <span className="font-bold mr-1">{courseContent?.totalQuiz || 0}</span>
                        <span>Bài tập</span>
                        <Image src="/video-number/red.svg" width={30} height={30} alt="" />
                    </span>
                </span>
                {type === 'my-course' && (
                    <span className="sm:before:content-['•'] sm:before:inline-block sm:before:text-gray-500 sm:before:mx-2">
                        <span className="mt-2 sm:mt-0 inline-flex items-center">
                            <span>Hoàn thành</span>
                            <span className="font-bold mx-1">
                                {type == 'my-course' ? courseContent?.totalCompleted : 0}
                            </span>
                            <span>/{courseContent?.totalVideo + courseContent?.totalQuiz}</span>
                            <Image src="/video-number/green.svg" width={30} height={30} alt="" />
                        </span>
                    </span>
                )}
            </div>
            <ul className="max-h-[500px] overflow-y-scroll mt-8">
                {courseContent?.listVideo?.map((videoItem: any, index: number) => (
                    <VideoItem
                        key={index}
                        videoItem={videoItem}
                        index={index}
                        type={
                            type === 'teacher-course'
                                ? 'teacher-video'
                                : type === 'teacher-course-draft'
                                ? 'teacher-video-draft'
                                : type === 'my-course'
                                ? 'my-video'
                                : type === 'admin-review'
                                ? 'admin-review-video'
                                : type === 'admin-view'
                                ? 'admin-view-video'
                                : undefined
                        }
                    />
                ))}
            </ul>
        </>
    );
};

export default CourseContent;
