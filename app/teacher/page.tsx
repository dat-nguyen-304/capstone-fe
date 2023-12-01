'use client';

import { teacherIncomeApi } from '@/api-client';
import Loader from '@/components/Loader';
import RevenueChart from '@/components/chart/teacher-dashboard/RevenueChart';
import RevenueChartMonth from '@/components/chart/teacher-dashboard/RevenueChartMonth';
import TopContributorItem from '@/components/dashboard/teacher/TopContributorItem';
import TopCourseContributorItem from '@/components/dashboard/teacher/TopCourseContributorItem';
import { Card, Tab, Tabs } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';

const formatCurrency = (value: number) => {
    const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);

    return formattedValue.replace('₫', ' VND');
};

const TeacherDashboard: React.FC = () => {
    const { data: incomeForMonth, isLoading } = useQuery<any>({
        queryKey: ['teacher-income-course-for-month'],
        queryFn: teacherIncomeApi.getTeacherRevenue
    });
    const { data: incomeData } = useQuery<any>({
        queryKey: ['teacher-income'],
        queryFn: teacherIncomeApi.getTeacherIncome
    });
    const { data: topIncomeData } = useQuery<any>({
        queryKey: ['teacher-top-income'],
        queryFn: () => teacherIncomeApi.getTeacherTopIncome('RECEIVED', 0, 5, 'revenue', 'DESC')
    });
    console.log(topIncomeData);

    const totalRevenue = incomeData ? incomeData.reduce((acc: any, item: any) => acc + item.revenue, 0) : 0;
    if (!incomeForMonth) return <Loader />;
    return (
        <div>
            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                <Card className="p-4 mt-4 sm:mt-0">
                    <div>
                        <h1 className="text-[14px] text-gray-500">Doanh thu tháng</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">{formatCurrency(totalRevenue / 100)}</span>
                    </div>
                    <div className="flex border-t-1 pt-2 text-[14px] border-gray-200">
                        <h2>Hôm nay</h2>
                        <span className="ml-2">{formatCurrency(totalRevenue / 100)}</span>
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
            <div className="lg:grid lg:grid-cols-10 gap-4 mt-8 px-0">
                <Card className="lg:col-span-7 p-4">
                    <Tabs color="primary" variant="underlined" aria-label="Tabs variants">
                        <Tab key="revenue" title="Doanh thu">
                            <RevenueChartMonth revenueData={incomeForMonth} />
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
                <Card className="lg:col-span-3 p-4 mt-8 lg:mt-0">
                    <h3 className="text-lg font-semibold">Top khóa học đóng góp</h3>
                    <ul>
                        {topIncomeData?.data?.map((topIncome: any, index: number) => (
                            <TopCourseContributorItem key={topIncome?.id} topIncome={topIncome} index={index} />
                        ))}
                        {/* <TopCourseContributorItem  /> */}
                        {/* <TopContributorItem />
                        <TopContributorItem />
                        <TopContributorItem />
                        <TopContributorItem />
                        <TopContributorItem />
                        <TopContributorItem /> */}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default TeacherDashboard;
