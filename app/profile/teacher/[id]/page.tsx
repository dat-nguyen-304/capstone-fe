'use client';

import { Card, Chip, Tab, Tabs } from '@nextui-org/react';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';
interface StudentProfileProps {}

const StudentProfile: React.FC<StudentProfileProps> = ({}) => {
    return (
        <Card className="w-[94%] xl:w-[90%] my-4 p-8 mx-auto min-h-[360px]">
            <div className=" md:flex items-start gap-8">
                <div className="col-span-4 xl:col-span-3 rounded-xl">
                    <Image src="/student.png" width={100} height={100} alt="" className="border-1 rounded-full" />
                </div>
                <div className="col-span-5 xl:col-span-6 mt-8 sm:mt-0 relative">
                    <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                        Nguyễn Văn An <MdVerified color="#0de298" />
                    </h3>
                    <div>
                        <div className="xl:flex items-center mt-4 sm:mt-8 xl:mt-4 gap-4">
                            <p className="text-sm sm:text-base font-semibold">Giáo viên môn</p>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                                <Chip color="primary">Toán học</Chip>
                                <Chip color="primary">Vật lí</Chip>
                            </div>
                        </div>
                        <div className="xl:flex items-center mt-4 sm:mt-8">
                            <p className="text-sm sm:text-base font-semibold">Ngày tham gia: 22/12/2023</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Tabs variant="underlined" aria-label="Tabs variants" className="mt-4">
                    <Tab key="description" title="Lời giới thiệu" className="p-0">
                        Abcxyz
                    </Tab>
                    <Tab key="course" title="Khóa học">
                        khóa học
                    </Tab>
                    <Tab key="video" title="Video">
                        video
                    </Tab>
                </Tabs>
            </div>
        </Card>
    );
};

export default StudentProfile;
