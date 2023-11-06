'use client';

import CommonInfo from '@/components/course/edit-course/CommonInfo';
import CourseContent from '@/components/course/edit-course/CouseContent';
import { Button, Tab, Tabs } from '@nextui-org/react';
import Link from 'next/link';

const EditCourse: React.FC = () => {
    return (
        <div className="w-[98%] sm:w-full lg:w-[90%] mx-auto">
            <div className="mt-4 sm:mt-0 flex justify-between">
                <h3 className="text-xl text-blue-500 font-semibold">Chỉnh sửa khóa học</h3>
                <Button size="sm" as={Link} href="/teacher/course/1">
                    Quay lại
                </Button>
            </div>
            <Tabs variant="underlined" aria-label="Tabs variants" className="mt-4">
                <Tab key="common" title="Thông tin chung" className="p-0">
                    <CommonInfo />
                </Tab>
                <Tab key="content" title="Nội dung">
                    <CourseContent />
                </Tab>
            </Tabs>
        </div>
    );
};

export default EditCourse;
