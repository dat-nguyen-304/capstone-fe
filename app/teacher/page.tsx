'use client';

import RevenueChart from '@/components/chart/teacher-dashboard/RevenueChart';
import TopContributorItem from '@/components/chart/teacher-dashboard/TopContributorItem';
import { Card, Tab, Tabs } from '@nextui-org/react';

const TeacherDashboard: React.FC = () => {
    return (
        <div className="">
            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                <Card className="p-4 mt-4 sm:mt-0">
                    <div>
                        <h1 className="text-[14px] text-gray-500">Doanh thu tháng</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">12.000.000</span>
                    </div>
                    <div className="flex border-t-1 pt-2 text-[14px] border-gray-200">
                        <h2>Hôm nay</h2>
                        <span className="ml-2">120.000</span>
                    </div>
                </Card>
                <Card className="p-4 mt-4 sm:mt-0">
                    <div>
                        <h1 className="text-[14px] text-gray-500">Khóa học</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">5.000</span>
                    </div>
                    <div className="flex border-t-1 pt-2 text-[14px] border-gray-200">
                        <h2>Hôm nay</h2>
                        <span className="ml-2">4</span>
                    </div>
                </Card>
                <Card className="p-4 mt-4 sm:mt-0">
                    <div>
                        <h1 className="text-[14px] text-gray-500">Video</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">12.000</span>
                    </div>
                    <div className="flex border-t-1 pt-2 text-[14px] border-gray-200">
                        <h2>Hôm nay</h2>
                        <span className="ml-2">40</span>
                    </div>
                </Card>
                <Card className="p-4 mt-4 sm:mt-0">
                    <div>
                        <h1 className="text-[14px] text-gray-500">Học sinh mới</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">12.000</span>
                    </div>
                    <div className="flex border-t-1 pt-2 text-[14px] border-gray-200">
                        <h2>Hôm nay</h2>
                        <span className="ml-2">120</span>
                    </div>
                </Card>
            </div>
            <div className="md:grid md:grid-cols-10 gap-4 mt-8 px-4">
                <Card className="md:col-span-7 p-4">
                    <Tabs color="primary" variant="underlined" aria-label="Tabs variants">
                        <Tab key="revenue" title="Doanh thu">
                            <RevenueChart />
                        </Tab>
                        <Tab key="course" title="Khóa học">
                            <RevenueChart />
                        </Tab>
                        <Tab key="video" title="Video">
                            <RevenueChart />
                        </Tab>
                        <Tab key="student" title="Học sinh">
                            <RevenueChart />
                        </Tab>
                    </Tabs>
                </Card>
                <Card className="md:col-span-3 p-4 mt-8 md:mt-0">
                    <h3 className="text-lg font-semibold">Top đóng góp</h3>
                    <ul>
                        <TopContributorItem />
                        <TopContributorItem />
                        <TopContributorItem />
                        <TopContributorItem />
                        <TopContributorItem />
                        <TopContributorItem />
                        <TopContributorItem />
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default TeacherDashboard;
