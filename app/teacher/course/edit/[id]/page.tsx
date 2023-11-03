'use client';

import CommonInfo from '@/components/course/edit-course/CommonInfo';
import CourseContent from '@/components/course/edit-course/CouseContent';
import { Tab, Tabs } from '@nextui-org/react';

const EditCourse: React.FC = () => {
    return (
        <div className="w-[98%] sm:w-full lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mt-4 sm:mt-0">Chỉnh sửa khóa học</h3>
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
