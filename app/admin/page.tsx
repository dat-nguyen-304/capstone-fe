'use client';

import { dashboardApi } from '@/api-client';
import Loader from '@/components/Loader';
import RevenueChart from '@/components/chart/teacher-dashboard/RevenueChart';
import TeacherStudentChart from '@/components/chart/teacher-dashboard/TeacherStudentChart';
import TopContributorItem from '@/components/dashboard/teacher/TopContributorItem';
import { Card, Tab, Tabs } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';

const AdminDashboard: React.FC = () => {
    const { data: dashboardData } = useQuery({
        queryKey: ['adminDashboard'],
        queryFn: dashboardApi.getAll
    });
    console.log(dashboardData);
    if (!dashboardData) return <Loader />;
    return (
        <div>
            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                <Card className="p-4 mt-4 sm:mt-0">
                    <div>
                        <h1 className="text-[14px] text-gray-500">Doanh thu tháng</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">{dashboardData?.monthlyIncome}</span>
                    </div>
                    {/* <div className="flex border-t-1 pt-2 text-[14px] border-gray-200">
                        <h2>Hôm nay</h2>
                        <span className="ml-2">120.000</span>
                    </div> */}
                </Card>
                <Card className="p-4 mt-4 sm:mt-0">
                    <div>
                        <h1 className="text-[14px] text-gray-500">Khóa học</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">{dashboardData?.totalCourse}</span>
                    </div>
                    {/* <div className="flex border-t-1 pt-2 text-[14px] border-gray-200">
                        <h2>Hôm nay</h2>
                        <span className="ml-2">4</span>
                    </div> */}
                </Card>
                <Card className="p-4 mt-4 sm:mt-0">
                    <div>
                        <h1 className="text-[14px] text-gray-500">Video</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">{dashboardData?.totalVideo}</span>
                    </div>
                    {/* <div className="flex border-t-1 pt-2 text-[14px] border-gray-200">
                        <h2>Hôm nay</h2>
                        <span className="ml-2">40</span>
                    </div> */}
                </Card>
                {/* <Card className="p-4 mt-4 sm:mt-0">
                    <div>
                        <h1 className="text-[14px] text-gray-500">Người dùng mới</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">12.000</span>
                    </div>
                    <div className="flex border-t-1 pt-2 text-[14px] border-gray-200">
                        <h2>Hôm nay</h2>
                        <span className="ml-2">120</span>
                    </div>
                </Card> */}
            </div>
            <div className="lg:grid lg:grid-cols-10 gap-4 mt-8 px-0">
                <Card className="lg:col-span-7 p-4">
                    <Tabs color="primary" variant="underlined" aria-label="Tabs variants">
                        <Tab key="revenue" title="Doanh thu">
                            <RevenueChart chartData={dashboardData?.transactionByMonths} />
                        </Tab>
                        <Tab key="course" title="Khóa học">
                            <RevenueChart />
                        </Tab>
                        <Tab key="video" title="Video">
                            <RevenueChart />
                        </Tab>
                        <Tab key="student" title="Người dùng">
                            <TeacherStudentChart />
                        </Tab>
                    </Tabs>
                </Card>
                {/* <Card className="lg:col-span-3 p-4 mt-8 lg:mt-0">
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
                </Card> */}
            </div>
        </div>
    );
};

export default AdminDashboard;
