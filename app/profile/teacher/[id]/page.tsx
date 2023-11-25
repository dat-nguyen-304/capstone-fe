'use client';

import { teacherApi } from '@/api-client';
import Loader from '@/components/Loader';
import CourseTab from '@/components/profile/CourseTab';
import VideoTab from '@/components/profile/VideoTab';
import { Button, Card, Chip, Tab, Tabs } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import HTMLReactParser from 'html-react-parser';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BsArrowLeft } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
interface StudentProfileProps {
    params: { id: string };
}

const StudentProfile: React.FC<StudentProfileProps> = ({ params }) => {
    const router = useRouter();
    const { data } = useQuery({
        queryKey: ['teacher-public-detail'],
        queryFn: () => teacherApi.getPublicTeacher(params.id)
    });

    if (!data) return <Loader />;

    const teacherData = data.data;

    return (
        <div className="w-[94%] xl:w-[90%] my-4 mx-auto ">
            <Button
                variant="light"
                className="mt-4 inline-flex items-center gap-2 text-sm cursor-pointer"
                onClick={() => router.back()}
            >
                <BsArrowLeft />
                <span>Quay lại</span>
            </Button>

            <Card className="p-8 my-4 min-h-[360px]">
                <div className=" md:flex items-start gap-8">
                    <div className="col-span-4 xl:col-span-3 rounded-xl">
                        <Image
                            src={teacherData.url || '/student.png'}
                            width={100}
                            height={100}
                            alt=""
                            className="border-1 rounded-full"
                        />
                    </div>
                    <div className="col-span-5 xl:col-span-6 mt-8 sm:mt-0 relative">
                        <h3 className="text-base text-blue-500 sm:text-2xl font-bold flex items-center gap-2">
                            {teacherData.fullName}
                            {/* <MdVerified color="#0de298" /> */}
                        </h3>
                        <div>
                            <div className="xl:flex items-center mt-4 gap-4">
                                <p className="text-sm text-[#444] sm:text-base font-semibold">Giáo viên môn</p>
                                <div className="flex gap-2 mt-2 xl:mt-0">
                                    {teacherData.subject.map((s: string) => (
                                        <Chip key={s} color="primary" variant="flat">
                                            {s}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                            <div className="xl:flex items-center mt-4">
                                <p className="text-sm text-[#444] sm:text-base font-semibold">
                                    <span className="mr-2">Ngày tham gia:</span>
                                    {new Intl.DateTimeFormat('en-GB', {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric'
                                    })?.format(teacherData.createDate || new Date())}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Tabs color="primary" variant="underlined" aria-label="Tabs variants" className="mt-4">
                        <Tab key="description" title="Lời giới thiệu" className="p-0">
                            <div className="mt-4">{HTMLReactParser(teacherData.description)}</div>
                        </Tab>
                        <Tab key="course" title="Khóa học">
                            <CourseTab teacher={params.id} />
                        </Tab>
                        <Tab key="video" title="Video">
                            <VideoTab teacher={params.id} />
                        </Tab>
                    </Tabs>
                </div>
            </Card>
        </div>
    );
};

export default StudentProfile;
